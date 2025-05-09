
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomEntry } from "@/services/symptomService";
import { Calendar, Loader2, ArrowDown, ArrowUp, Minus } from "lucide-react";

interface RecentEntriesProps {
  isLoading: boolean;
  entries: SymptomEntry[];
}

export const RecentEntries = ({ isLoading, entries }: RecentEntriesProps) => {
  const getTrendIcon = (currentValue: number, previousValue: number) => {
    if (currentValue < previousValue) {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    } else if (currentValue > previousValue) {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>Your latest symptom records</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-cog-purple" />
                    <span className="font-medium">{entry.date}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                    <span>Headache:</span>
                    <div className="flex items-center">
                      {entry.symptoms.headache}
                      {entries[1] && getTrendIcon(
                        entry.symptoms.headache,
                        entries[1].symptoms.headache
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                    <span>Fatigue:</span>
                    <div className="flex items-center">
                      {entry.symptoms.fatigue}
                      {entries[1] && getTrendIcon(
                        entry.symptoms.fatigue,
                        entries[1].symptoms.fatigue
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                    <span>Anxiety:</span>
                    <div className="flex items-center">
                      {entry.symptoms.anxiety}
                      {entries[1] && getTrendIcon(
                        entry.symptoms.anxiety,
                        entries[1].symptoms.anxiety
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                    <span>Focus:</span>
                    <div className="flex items-center">
                      {entry.symptoms.focus}
                      {entries[1] && getTrendIcon(
                        entry.symptoms.focus,
                        entries[1].symptoms.focus
                      )}
                    </div>
                  </div>
                </div>
                
                {entry.notes && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No symptom entries yet. Start tracking to see your history here.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
