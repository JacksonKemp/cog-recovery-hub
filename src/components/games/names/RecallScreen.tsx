
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface UserAnswers {
  [key: number]: {
    firstName: string;
    lastName: string;
  };
}

interface RecallScreenProps {
  people: Person[];
  userAnswers: UserAnswers;
  onInputChange: (personId: number, field: 'firstName' | 'lastName', value: string) => void;
  onCheckAnswers: () => void;
  onCancel: () => void;
}

const RecallScreen = ({ 
  people, 
  userAnswers, 
  onInputChange, 
  onCheckAnswers, 
  onCancel 
}: RecallScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Enter the names</h2>
      
      <div className="grid gap-6 mb-8 max-w-md mx-auto">
        {people.map((person) => (
          <Card key={person.id}>
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-2">Person #{person.id}</div>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text"
                  placeholder="First Name"
                  className="px-3 py-2 border rounded-md"
                  value={userAnswers[person.id]?.firstName || ''}
                  onChange={(e) => onInputChange(person.id, 'firstName', e.target.value)}
                />
                <input 
                  type="text"
                  placeholder="Last Name"
                  className="px-3 py-2 border rounded-md"
                  value={userAnswers[person.id]?.lastName || ''}
                  onChange={(e) => onInputChange(person.id, 'lastName', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onCheckAnswers} 
          disabled={Object.keys(userAnswers).length === 0}
        >
          Check Answers
        </Button>
      </div>
    </div>
  );
};

export default RecallScreen;
