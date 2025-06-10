
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get game progress data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: gameProgress, error } = await supabaseClient
      .from('game_progress')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!gameProgress || gameProgress.length === 0) {
      return new Response(JSON.stringify({ 
        insights: "No game data available yet. Start playing some cognitive games to get personalized insights about your performance!" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyze the data
    const categories = ['memory', 'attention', 'processing'];
    const analysisData = categories.map(category => {
      const categoryGames = gameProgress.filter(game => game.category === category);
      if (categoryGames.length === 0) return null;

      const recentGames = categoryGames.slice(0, 10); // Last 10 games
      const olderGames = categoryGames.slice(10);

      const recentAvg = recentGames.reduce((sum, game) => {
        if (game.max_score && game.max_score > 0) {
          return sum + (game.score / game.max_score * 100);
        }
        return sum;
      }, 0) / recentGames.length;

      const olderAvg = olderGames.length > 0 ? olderGames.reduce((sum, game) => {
        if (game.max_score && game.max_score > 0) {
          return sum + (game.score / game.max_score * 100);
        }
        return sum;
      }, 0) / olderGames.length : 0;

      const improvement = olderGames.length > 0 ? recentAvg - olderAvg : 0;
      const avgDifficulty = recentGames.reduce((sum, game) => sum + (game.level || 2), 0) / recentGames.length;

      return {
        category,
        totalGames: categoryGames.length,
        recentAvg: Math.round(recentAvg),
        improvement: Math.round(improvement),
        avgDifficulty,
        consistency: Math.round(100 - (recentGames.reduce((sum, game, index) => {
          if (index === 0) return sum;
          const prev = recentGames[index - 1];
          if (prev.max_score && game.max_score && prev.max_score > 0 && game.max_score > 0) {
            const prevScore = prev.score / prev.max_score * 100;
            const currScore = game.score / game.max_score * 100;
            return sum + Math.abs(currScore - prevScore);
          }
          return sum;
        }, 0) / Math.max(recentGames.length - 1, 1)))
      };
    }).filter(Boolean);

    const prompt = `Based on this cognitive game performance data over the last 6 months, provide brief personalized insights in a friendly, encouraging tone.

Data: ${JSON.stringify(analysisData)}

Provide 1-2 specific insights about performance trends and one actionable recommendation. Keep it concise (max 75 words) and encouraging. Use specific percentages and mention categories by name.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        insights: `You've played ${gameProgress.length} games across ${analysisData.length} categories over the last 6 months. Your recent performance shows consistent engagement with cognitive exercises!` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a cognitive health coach providing brief, personalized insights based on game performance data.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const insights = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
