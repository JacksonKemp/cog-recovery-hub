
import PersonCard from "./PersonCard";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface MemorizeScreenProps {
  people: Person[];
}

const MemorizeScreen = ({ people }: MemorizeScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Memorize these names</h2>
      
      <div className="grid gap-4 mb-6 max-w-md mx-auto">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default MemorizeScreen;
