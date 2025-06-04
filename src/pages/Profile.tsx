import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [ptKey, setPtKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("pt_key")
        .eq("id", user.id)
        .single();
      if (error) {
        toast.error("Failed to fetch PT-Key");
        setLoading(false);
        return;
      }
      setPtKey(data.pt_key);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ptKey);
    toast.success("PT-Key copied to clipboard");
  };

  const handleRegenerate = async () => {
    if (!user) return;
    setRegenerating(true);
    // Generate a new key in the backend
    const { data, error } = await supabase.rpc("regenerate_pt_key", { user_id: user.id });
    if (error) {
      toast.error("Failed to regenerate PT-Key");
      setRegenerating(false);
      return;
    }
    setPtKey(data);
    toast.success("PT-Key regenerated");
    setRegenerating(false);
  };

  return (
    <div className="container py-8 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block font-medium mb-2">PT-Key (Practitioner Key)</label>
            <div className="flex items-center gap-2">
              <Input
                type={showKey ? "text" : "password"}
                value={ptKey}
                readOnly
                className="w-full"
                style={{ fontFamily: "monospace" }}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => setShowKey((v) => !v)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={handleCopy} disabled={!ptKey}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={handleRegenerate} disabled={regenerating}>
                <RefreshCw className={regenerating ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Keep this key private. Share it only with your practitioner to grant access.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 