import { Dumbbell, Heart, Zap, Wind, Bike, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";

const exerciseCategories = [
  {
    icon: Zap,
    title: "HIIT",
    exercises: 12,
    duration: "15-30 min",
    points: "40-80",
    color: "activity",
  },
  {
    icon: Dumbbell,
    title: "Strength",
    exercises: 18,
    duration: "20-45 min",
    points: "50-100",
    color: "wellness",
  },
  {
    icon: Wind,
    title: "Yoga",
    exercises: 15,
    duration: "15-60 min",
    points: "30-90",
    color: "mind",
  },
  {
    icon: Bike,
    title: "Cardio",
    exercises: 10,
    duration: "20-40 min",
    points: "45-85",
    color: "activity",
  },
  {
    icon: PersonStanding,
    title: "Flexibility",
    exercises: 14,
    duration: "10-25 min",
    points: "25-60",
    color: "sleep",
  },
  {
    icon: Heart,
    title: "Recovery",
    exercises: 8,
    duration: "15-30 min",
    points: "20-50",
    color: "wellness",
  },
];

const colorStyles = {
  activity: "from-activity/20 to-activity/10 border-activity/30 text-activity-foreground",
  wellness: "from-wellness/20 to-wellness/10 border-wellness/30 text-wellness-foreground",
  mind: "from-mind/20 to-mind/10 border-mind/30 text-mind-foreground",
  sleep: "from-sleep/20 to-sleep/10 border-sleep/30 text-sleep-foreground",
};

export default function Training() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-wellness text-wellness-foreground px-6 py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Training Grounds</h1>
          <p className="opacity-90">Choose your workout and earn points for your guild</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-6">
        {/* Featured Workout */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border-2 border-primary/30 shadow-medium mb-6 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Featured</span>
              <h2 className="text-xl font-bold text-foreground mt-1">Guild Challenge</h2>
            </div>
            <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold">
              +100 pts
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Complete a 30-minute full-body workout to help your guild catch up in the league!
          </p>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            Start Challenge
          </Button>
        </div>

        {/* Exercise Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Exercise Library</h2>
          <div className="grid grid-cols-2 gap-4">
            {exerciseCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className={`
                    rounded-2xl p-5 border-2 shadow-soft hover:shadow-medium
                    transition-all duration-300 hover:scale-105 cursor-pointer
                    animate-fade-in bg-gradient-to-br
                    ${colorStyles[category.color as keyof typeof colorStyles]}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="h-8 w-8 mb-3 opacity-90" />
                  <h3 className="font-bold text-foreground mb-2">{category.title}</h3>
                  <div className="space-y-1 text-xs opacity-75">
                    <p>{category.exercises} exercises</p>
                    <p>{category.duration}</p>
                    <p className="font-semibold text-primary">{category.points} points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AR Form Coach Teaser */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-primary rounded-xl p-3">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">AR Form Coach</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get real-time feedback on your exercise form with AI-powered pose detection.
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
