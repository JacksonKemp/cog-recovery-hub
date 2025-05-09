
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { verifyPractitionerAccess } from "@/services/practitionerAuthService";
import { toast } from "sonner";

const PractitionerAuth = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }

    try {
      setIsLoading(true);
      const patient = await verifyPractitionerAccess(accessCode);
      
      if (patient) {
        toast.success(`Access granted to ${patient.fullName || patient.email}'s data`);
        navigate("/practitioner/dashboard");
      } else {
        toast.error("Invalid or expired access code");
      }
    } catch (error) {
      toast.error("Failed to verify access code");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-cog-light-teal rounded-full p-3 mb-2">
            <Brain className="h-8 w-8 text-cog-teal" />
          </div>
          <CardTitle className="text-2xl text-center">Practitioner Access</CardTitle>
          <CardDescription className="text-center">
            Enter the access code provided by your patient
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="access-code"
                placeholder="Enter access code (e.g., AB12CD34)"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-wider"
                disabled={isLoading}
                maxLength={8}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Patient Data"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PractitionerAuth;
