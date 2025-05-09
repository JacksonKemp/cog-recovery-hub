
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PractitionerAccessModal } from "@/components/PractitionerAccessModal";
import { getUserPractitioners, PractitionerAccess } from "@/services/practitionerService";
import { toast } from "sonner";
import { UserCog } from "lucide-react";

export const PractitionerAccessButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [practitioners, setPractitioners] = useState<PractitionerAccess[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPractitioners = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPractitioners();
      setPractitioners(data);
    } catch (error) {
      console.error("Error fetching practitioners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchPractitioners();
    }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePractitionerAdded = () => {
    fetchPractitioners();
  };

  const handlePractitionerUpdated = () => {
    fetchPractitioners();
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="flex gap-2 items-center"
        onClick={handleOpenModal}
      >
        <UserCog className="h-4 w-4" />
        <span>Practitioner Access</span>
      </Button>

      <PractitionerAccessModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        practitioners={practitioners}
        onPractitionerAdded={handlePractitionerAdded}
        onPractitionerUpdated={handlePractitionerUpdated}
      />
    </>
  );
};
