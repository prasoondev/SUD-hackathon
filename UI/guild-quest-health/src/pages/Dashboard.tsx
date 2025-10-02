import { Bell, Footprints, Moon, Droplets, Dumbbell, Brain, Sparkles, Gift, Trophy } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { dbService } from "@/lib/database";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const recommendations = [
  {
    icon: Dumbbell,
    title: "Morning HIIT Session",
    description: "Your guild needs cardio points! 20-min high intensity workout.",
    points: 50,
    variant: "activity" as const,
  },
  {
    icon: Brain,
    title: "Meditation Break",
    description: "Take 10 minutes to center yourself and boost your mind score.",
    points: 30,
    variant: "mind" as const,
  },
  {
    icon: Moon,
    title: "Sleep Tracking",
    description: "Log your sleep quality to help the team's wellness goal.",
    points: 40,
    variant: "sleep" as const,
  },
];

export default function Dashboard() {
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
          if (balanceResult.success && balanceResult.balance !== undefined) {
            setBalance(balanceResult.balance);
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

  const completedObjectives = objectives.filter(obj => obj.is_completed).length;
  const totalObjectives = objectives.length;
  const unlockedAchievements = achievements.filter(ach => ach.is_unlocked).length;

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
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground px-6 py-6 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Welcome back,</p>
              <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-bold">
                  {balanceLoading ? '...' : balance.toLocaleString()}
                </span>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary-foreground/20">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Rewards Overview */}
        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Rewards Overview
              </h2>
              <Link to="/rewards">
                <Button size="sm" variant="outline">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground">
                  {completedObjectives}/{totalObjectives}
                </p>
                <p className="text-sm text-muted-foreground">Daily Objectives</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-xl font-bold text-foreground">{unlockedAchievements}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
            
            {(objectives.some(obj => obj.can_claim) || achievements.some(ach => ach.can_claim)) && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    You have rewards ready to claim!
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            Today's Activity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={Footprints}
              label="Steps"
              value="8,234"
              variant="activity"
              subtitle="Goal: 10,000"
            />
            <StatCard
              icon={Dumbbell}
              label="Exercise"
              value="25"
              unit="min"
              variant="wellness"
              subtitle="3 workouts"
            />
            <StatCard
              icon={Moon}
              label="Sleep"
              value="7.5"
              unit="hrs"
              variant="sleep"
              subtitle="Last night"
            />
            <StatCard
              icon={Droplets}
              label="Hydration"
              value="1.8"
              unit="L"
              variant="hydration"
              subtitle="Goal: 2.5L"
            />
          </div>
        </div>

        {/* Mind & Wellness Score */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={Brain}
            label="Mind Score"
            value="82"
            variant="mind"
            subtitle="Updated 2h ago"
          />
          <StatCard
            icon={Sparkles}
            label="Wellness"
            value="75"
            variant="wellness"
            subtitle="Keep it up!"
          />
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended for You
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-5 shadow-soft mb-6">
          <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Droplets className="mr-2 h-5 w-5 text-hydration" />
              Log Water Intake
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Moon className="mr-2 h-5 w-5 text-sleep" />
              Record Sleep Quality
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
