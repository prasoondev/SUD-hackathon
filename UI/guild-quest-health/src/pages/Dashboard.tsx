import { Bell, Footprints, Moon, Droplets, Dumbbell, Brain, Sparkles } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { GuildProgress } from "@/components/GuildProgress";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground px-6 py-6 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Welcome back,</p>
              <h1 className="text-2xl font-bold">Harish</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-bold">1,245</span>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary-foreground/20">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Guild Progress */}
        <div className="mb-6">
          <GuildProgress
            guildName="The Active Avengers"
            currentPoints={8420}
            goalPoints={12000}
            memberCount={12}
          />
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
