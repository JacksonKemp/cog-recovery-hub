
import { toast } from "sonner";
import { saveGameProgress } from "./gameProgressService";

/**
 * Test function to manually save game progress data
 * @returns boolean indicating success of the operation
 */
export const testSaveGameProgress = async (): Promise<boolean> => {
  try {
    const result = await saveGameProgress(
      'test-game', 
      'memory', 
      100,
      100,
      1,
      60
    );
    console.log("Test save result:", result);
    toast.success("Test save completed successfully");
    return !!result;
  } catch (error) {
    console.error("Test save failed:", error);
    toast.error("Test save failed");
    return false;
  }
};
