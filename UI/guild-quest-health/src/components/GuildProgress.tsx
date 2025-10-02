import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GuildProgressProps {
  guildName: string;
  currentPoints: number;
  goalPoints: number;
  memberCount: number;
}

export function GuildProgress({
  guildName,
  currentPoints,
  goalPoints,
  memberCount,
}: GuildProgressProps) {
  const percentage = Math.min((currentPoints / goalPoints) * 100, 100);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-medium animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{guildName}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">{memberCount} members</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{currentPoints}</div>
          <div className="text-xs text-muted-foreground">/ {goalPoints} pts</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Weekly Goal Progress</span>
          <span className="font-semibold text-foreground">{percentage.toFixed(0)}%</span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Keep pushing! Every activity helps your guild reach the goal.
        </p>
      </div>
    </div>
  );
}
