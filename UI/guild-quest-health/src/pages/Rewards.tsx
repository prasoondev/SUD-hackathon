import { useState, useEffect } from "react";
import { Coins, Gift, Trophy } from "lucide-react";
import { DailyObjectives } from "@/components/DailyObjectives";
import { Achievements } from "@/components/Achievements";
import { useAuth } from "@/contexts/AuthContext";
import { dbService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Rewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [objectivesLoading, setObjectivesLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch balance
          const balanceResult = await dbService.getBalance();
          if (balanceResult.success) {
            setBalance(balanceResult.balance || 0);
          }

          // Fetch daily objectives
          const objectivesResult = await dbService.getDailyObjectives();
          if (objectivesResult.success && objectivesResult.objectives) {
            setObjectives(objectivesResult.objectives);
          }

          // Fetch achievements
          const achievementsResult = await dbService.getAchievements();
          if (achievementsResult.success && achievementsResult.achievements) {
            setAchievements(achievementsResult.achievements);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setBalanceLoading(false);
          setObjectivesLoading(false);
          setAchievementsLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleClaimObjectiveReward = async (objectiveId: number) => {
    try {
      const result = await dbService.claimObjectiveReward(objectiveId);
      if (result.success) {
        toast({
          title: "Reward Claimed!",
          description: result.message,
        });
        if (result.newBalance !== undefined) {
          setBalance(result.newBalance);
        }
        // Update objectives to reflect claimed state
        setObjectives(prev => prev.map(obj => 
          obj.id === objectiveId 
            ? { ...obj, can_claim: false }
            : obj
        ));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to claim reward",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error claiming objective reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive",
      });
    }
  };

  const handleClaimAchievementReward = async (achievementId: number) => {
    try {
      const result = await dbService.claimAchievementReward(achievementId);
      if (result.success) {
        toast({
          title: "Achievement Reward Claimed!",
          description: result.message,
        });
        if (result.newBalance !== undefined) {
          setBalance(result.newBalance);
        }
        // Update achievements to reflect claimed state
        setAchievements(prev => prev.map(ach => 
          ach.id === achievementId 
            ? { ...ach, can_claim: false }
            : ach
        ));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to claim achievement reward",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error claiming achievement reward:', error);
      toast({
        title: "Error",
        description: "Failed to claim achievement reward",
        variant: "destructive",
      });
    }
  };

  const completedObjectives = objectives.filter(obj => obj.is_completed).length;
  const unlockedAchievements = achievements.filter(ach => ach.is_unlocked).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Gift className="h-6 w-6" />
                Rewards
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Complete objectives and unlock achievements
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="bg-background/10 backdrop-blur-sm border-primary-foreground/20">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Coins className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-foreground/80">Total Balance</p>
                    {balanceLoading ? (
                      <Skeleton className="h-6 w-20 bg-primary-foreground/20" />
                    ) : (
                      <p className="text-xl font-bold">{balance.toLocaleString()} coins</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground">
                  Blockchain Secured
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completedObjectives}</p>
            <p className="text-sm text-muted-foreground">Objectives Complete</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{unlockedAchievements}</p>
            <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
          </Card>
        </div>

        {/* Daily Objectives */}
        {objectivesLoading ? (
          <Card className="p-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </Card>
        ) : (
          <DailyObjectives
            objectives={objectives}
            onClaimReward={handleClaimObjectiveReward}
          />
        )}

        {/* Achievements */}
        {achievementsLoading ? (
          <Card className="p-4">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </Card>
        ) : (
          <Achievements
            achievements={achievements}
            onClaimReward={handleClaimAchievementReward}
          />
        )}
      </div>
    </div>
  );
}