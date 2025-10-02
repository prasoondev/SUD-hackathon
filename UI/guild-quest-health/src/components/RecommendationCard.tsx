import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  points: number;
  variant: "activity" | "wellness" | "sleep" | "mind";
  onStart?: () => void;
}

const variantStyles = {
  activity: "border-activity/30 hover:border-activity/50 bg-activity/5",
  wellness: "border-wellness/30 hover:border-wellness/50 bg-wellness/5",
  sleep: "border-sleep/30 hover:border-sleep/50 bg-sleep/5",
  mind: "border-mind/30 hover:border-mind/50 bg-mind/5",
};

const iconVariantStyles = {
  activity: "text-activity bg-activity/10",
  wellness: "text-wellness bg-wellness/10",
  sleep: "text-sleep bg-sleep/10",
  mind: "text-mind bg-mind/10",
};

export function RecommendationCard({
  icon: Icon,
  title,
  description,
  points,
  variant,
  onStart,
}: RecommendationCardProps) {
  return (
    <div
      className={cn(
        "min-w-[280px] snap-center rounded-2xl border-2 p-5 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">+{points}</div>
          <div className="text-xs text-muted-foreground">points</div>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <Button
        onClick={onStart}
        variant="outline"
        className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Start Activity
      </Button>
    </div>
  );
}
