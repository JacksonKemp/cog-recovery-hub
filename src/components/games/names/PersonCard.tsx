
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface PersonCardProps {
  person: Person;
}

const PersonCard = ({ person }: PersonCardProps) => {
  return (
    <Card key={person.id}>
      <CardContent className="p-4 flex items-center justify-center">
        <div className="mr-4 bg-muted h-12 w-12 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold">
            {person.firstName.charAt(0)}{person.lastName.charAt(0)}
          </span>
        </div>
        <div className="text-left">
          <div className="font-semibold">{person.firstName} {person.lastName}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
