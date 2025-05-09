
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PractitionerAccess, addPractitioner, revokePractitionerAccess, regenerateAccessCode } from "@/services/practitionerService";
import { Clipboard, Check, X, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface PractitionerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  practitioners: PractitionerAccess[];
  onPractitionerAdded: () => void;
  onPractitionerUpdated: () => void;
}

export const PractitionerAccessModal = ({
  isOpen,
  onClose,
  practitioners,
  onPractitionerAdded,
  onPractitionerUpdated
}: PractitionerAccessModalProps) => {
  const [newPractitioner, setNewPractitioner] = useState({
    name: "",
    email: "",
    specialty: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const resetForm = () => {
    setNewPractitioner({
      name: "",
      email: "",
      specialty: ""
    });
  };

  const handleAddPractitioner = async () => {
    try {
      setIsAdding(true);
      const { name, email, specialty } = newPractitioner;
      
      if (!name.trim() || !email.trim()) {
        toast.error("Name and email are required");
        return;
      }
      
      await addPractitioner(name, email, specialty);
      toast.success("Practitioner added successfully");
      onPractitionerAdded();
      resetForm();
    } catch (error) {
      toast.error("Failed to add practitioner");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Access code copied to clipboard");
      setTimeout(() => setCopiedCode(null), 3000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleRegenerateCode = async (practitionerAccessId: string) => {
    try {
      setIsRegenerating(practitionerAccessId);
      await regenerateAccessCode(practitionerAccessId);
      toast.success("Access code regenerated");
      onPractitionerUpdated();
    } catch (error) {
      toast.error("Failed to regenerate access code");
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleRevokeAccess = async (practitionerAccessId: string) => {
    try {
      setIsRevoking(practitionerAccessId);
      await revokePractitionerAccess(practitionerAccessId);
      toast.success("Practitioner access revoked");
      onPractitionerUpdated();
    } catch (error) {
      toast.error("Failed to revoke access");
    } finally {
      setIsRevoking(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Practitioner Access</DialogTitle>
          <DialogDescription>
            Generate access codes for your healthcare practitioners to view your data.
          </DialogDescription>
        </DialogHeader>

        {/* Practitioner List */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Your Practitioners</h3>
          {practitioners.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Access Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {practitioners.map((access) => (
                    <TableRow key={access.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{access.practitioner.name}</div>
                          <div className="text-xs text-muted-foreground">{access.practitioner.email}</div>
                          {access.practitioner.specialty && (
                            <div className="text-xs text-muted-foreground">{access.practitioner.specialty}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">{access.access_code}</code>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6" 
                            onClick={() => handleCopyCode(access.access_code)}
                          >
                            {copiedCode === access.access_code ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Clipboard className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${access.is_active ? 'bg-cog-light-teal text-cog-teal' : 'bg-muted text-muted-foreground'}`}>
                          {access.is_active ? 'Active' : 'Revoked'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7"
                            disabled={!access.is_active || isRegenerating === access.id}
                            onClick={() => handleRegenerateCode(access.id)}
                          >
                            <RotateCw className={`h-3.5 w-3.5 ${isRegenerating === access.id ? 'animate-spin' : ''}`} />
                          </Button>
                          {access.is_active && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              disabled={isRevoking === access.id}
                              onClick={() => handleRevokeAccess(access.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 text-center border rounded-md">
              No practitioners added yet
            </div>
          )}
        </div>

        {/* Add New Practitioner */}
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-3">Add New Practitioner</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={newPractitioner.name}
                  onChange={(e) => setNewPractitioner({ ...newPractitioner, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="doctor@hospital.com"
                  type="email"
                  value={newPractitioner.email}
                  onChange={(e) => setNewPractitioner({ ...newPractitioner, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty (optional)</Label>
                <Input
                  id="specialty"
                  placeholder="Neurologist"
                  value={newPractitioner.specialty}
                  onChange={(e) => setNewPractitioner({ ...newPractitioner, specialty: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-y-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleAddPractitioner} 
            disabled={isAdding || !newPractitioner.name || !newPractitioner.email}
          >
            {isAdding ? "Adding..." : "Add Practitioner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
