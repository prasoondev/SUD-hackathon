import { useState } from "react";
import { Check, Clock, Gift, Footprints, Dumbbell, Droplets, Moon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DailyObjective {
  id: number;
  name: string;
  description: string;
  requirement: number;
  current_progress: number;
  reward_amount: number;
  icon: string;
  is_completed: boolean;
  can_claim: boolean;
}

interface DailyObjectivesProps {
  objectives: DailyObjective[];
  onClaimReward: (objectiveId: number) => void;
}

const iconMap: { [key: string]: any } = {
  footprints: Footprints,
  dumbbell: Dumbbell,
  droplets: Droplets,
  moon: Moon,
  brain: Brain,
};

export function DailyObjectives({ objectives, onClaimReward }: DailyObjectivesProps) {
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const handleClaim = async (objectiveId: number) => {
    setClaimingId(objectiveId);
    try {
      await onClaimReward(objectiveId);
    } finally {
      setClaimingId(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Clock;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Daily Objectives
        </h2>
        <Badge variant="secondary">
          {objectives.filter(obj => obj.is_completed).length}/{objectives.length} Complete
        </Badge>
      </div>

      <div className="space-y-3">
        {objectives.map((objective) => {
          const IconComponent = getIconComponent(objective.icon);
          const progressPercentage = Math.min((objective.current_progress / objective.requirement) * 100, 100);
          
          return (
            <Card key={objective.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  objective.is_completed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {objective.is_completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-foreground">{objective.name}</h3>
                      <p className="text-sm text-muted-foreground">{objective.description}</p>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-sm font-medium text-primary">
                        +{objective.reward_amount} coins
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Progress: {objective.current_progress.toLocaleString()} / {objective.requirement.toLocaleString()}
                      </span>
                      <span className="font-medium">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    {objective.is_completed && !objective.can_claim ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Claimed
                      </Badge>
                    ) : objective.can_claim ? (
                      <Button
                        size="sm"
                        onClick={() => handleClaim(objective.id)}
                        disabled={claimingId === objective.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {claimingId === objective.id ? 'Claiming...' : 'Claim Reward'}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        In Progress
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}