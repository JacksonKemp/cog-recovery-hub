
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

    // Get symptom data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: symptomEntries, error } = await supabaseClient
      .from('symptom_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    if (!symptomEntries || symptomEntries.length === 0) {
      return new Response(JSON.stringify({ 
        insights: "No symptom data available yet. Start tracking your symptoms to get personalized insights about your recovery progress!" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Analyze the symptom data
    const symptoms = ['headache', 'fatigue', 'anxiety', 'focus'];
    const analysisData = symptoms.map(symptom => {
      const values = symptomEntries.map(entry => entry.symptoms[symptom] || 0);
      const recent = values.slice(-7); // Last 7 entries
      const older = values.slice(0, -7);

      const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      const olderAvg = older.length > 0 ? older.reduce((sum, val) => sum + val, 0) / older.length : 0;
      
      const improvement = older.length > 0 ? olderAvg - recentAvg : 0;
      const trend = improvement > 0.5 ? 'improving' : improvement < -0.5 ? 'worsening' : 'stable';
      
      return {
        symptom,
        recentAvg: Math.round(recentAvg * 10) / 10,
        olderAvg: Math.round(olderAvg * 10) / 10,
        improvement: Math.round(improvement * 10) / 10,
        trend,
        totalEntries: values.length
      };
    });

    const prompt = `Based on this symptom tracking data, provide a brief summary of symptom trends and tracking consistency. Keep it short (max 50 words), conversational, and avoid giving advice or using numbered lists.

Data: ${JSON.stringify(analysisData)}
Total entries: ${symptomEntries.length}

Focus only on: what symptoms are doing (improving/stable/worsening) and how consistently the user has been tracking. Be encouraging about their tracking efforts.`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        insights: `You've tracked ${symptomEntries.length} symptom entries over the last 30 days. Your consistent monitoring shows great dedication to your recovery journey!` 
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
          { role: 'system', content: 'You are a supportive healthcare companion providing brief status updates based on symptom tracking data.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    const aiData = await response.json();
    const insights = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating symptom insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
