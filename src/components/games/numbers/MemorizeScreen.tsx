
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";

interface MemorizeScreenProps {
  numbers: string;
}

const MemorizeScreen = ({ numbers }: MemorizeScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Memorize these numbers</h2>
      
      <Card className="mb-6">
        <CardContent className="p-10">
          <div className="text-4xl font-bold tracking-wider">{numbers}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemorizeScreen;
