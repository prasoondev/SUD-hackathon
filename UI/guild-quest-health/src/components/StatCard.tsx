import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  variant: "activity" | "wellness" | "sleep" | "mind" | "hydration";
  subtitle?: string;
  className?: string;
}

const variantStyles = {
  activity: "bg-gradient-activity text-activity-foreground",
  wellness: "bg-gradient-wellness text-wellness-foreground",
  sleep: "bg-gradient-sleep text-sleep-foreground",
  mind: "bg-gradient-mind text-mind-foreground",
  hydration: "bg-gradient-hydration text-hydration-foreground",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  variant,
  subtitle,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="h-6 w-6 opacity-90" />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium opacity-90">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{value}</span>
          {unit && <span className="text-sm font-medium opacity-80">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-xs opacity-75 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
