import { useState } from "react";
import { Trophy, Star, Lock, Gift, Footprints, Dumbbell, Droplets, Moon, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: number;
  name: string;
  description: string;
  requirement_type: string;
  requirement_value: string;
  reward_amount: number;
  icon: string;
  is_unlocked: boolean;
  can_claim: boolean;
}

interface AchievementsProps {
  achievements: Achievement[];
  onClaimReward: (achievementId: number) => void;
}

const iconMap: { [key: string]: any } = {
  footprints: Footprints,
  dumbbell: Dumbbell,
  droplets: Droplets,
  moon: Moon,
  brain: Brain,
  sparkles: Sparkles,
};

export function Achievements({ achievements, onClaimReward }: AchievementsProps) {
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const handleClaim = async (achievementId: number) => {
    setClaimingId(achievementId);
    try {
      await onClaimReward(achievementId);
    } finally {
      setClaimingId(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Trophy;
  };

  const unlockedAchievements = achievements.filter(a => a.is_unlocked);
  const lockedAchievements = achievements.filter(a => !a.is_unlocked);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </h2>
        <Badge variant="secondary">
          {unlockedAchievements.length}/{achievements.length} Unlocked
        </Badge>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Unlocked
          </h3>
          {unlockedAchievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon);
            
            return (
              <Card key={achievement.id} className="p-4 border-yellow-200 bg-yellow-50/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                          {achievement.name}
                          <Star className="h-4 w-4 text-yellow-500" />
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-medium text-yellow-600">
                          +{achievement.reward_amount} coins
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      {!achievement.can_claim ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Claimed
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleClaim(achievement.id)}
                          disabled={claimingId === achievement.id}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          {claimingId === achievement.id ? 'Claiming...' : 'Claim Reward'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Locked
          </h3>
          {lockedAchievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon);
            
            return (
              <Card key={achievement.id} className="p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-muted-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right ml-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          +{achievement.reward_amount} coins
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}