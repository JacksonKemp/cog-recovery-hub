
import { Activity } from "lucide-react";

export const InsightPanel = () => {
  return (
    <div className="mt-8 p-6 rounded-lg bg-cog-light-purple">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <Activity className="h-6 w-6 text-cog-purple" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Recovery Insights</h3>
          <p className="text-muted-foreground max-w-xl">
            Your headache and fatigue symptoms have been improving over the last week. 
            Focus and concentration continue to show positive trends.
          </p>
        </div>
      </div>
    </div>
  );
};
