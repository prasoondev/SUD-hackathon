import { Trophy, Medal, Award, Star, Shield, Crown, Camera, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const achievements = [
  {
    icon: Crown,
    title: "Gold League Champion",
    description: "Won first place in Gold League",
    date: "March 2025",
    rarity: "legendary",
    unlocked: true,
  },
  {
    icon: Trophy,
    title: "30-Day Streak",
    description: "Maintained activity for 30 consecutive days",
    date: "February 2025",
    rarity: "epic",
    unlocked: true,
  },
  {
    icon: Shield,
    title: "Guild Founder",
    description: "Created The Active Avengers guild",
    date: "January 2025",
    rarity: "rare",
    unlocked: true,
  },
  {
    icon: Star,
    title: "Top Contributor",
    description: "Highest points in your guild for a week",
    date: "This week",
    rarity: "epic",
    unlocked: true,
  },
  {
    icon: Medal,
    title: "First Victory",
    description: "Complete your first workout",
    date: "January 2025",
    rarity: "common",
    unlocked: true,
  },
  {
    icon: Award,
    title: "Team Player",
    description: "Help your guild achieve a weekly goal",
    date: "Locked",
    rarity: "rare",
    unlocked: false,
  },
];

const rarityStyles = {
  legendary: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-600",
  epic: "from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-600",
  rare: "from-blue-500/20 to-blue-600/20 border-blue-500/50 text-blue-600",
  common: "from-gray-400/20 to-gray-500/20 border-gray-400/50 text-gray-600",
  locked: "from-muted/20 to-muted/20 border-border text-muted-foreground",
};

export default function Trophies() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-500 text-yellow-950 px-6 py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Trophy Room</h1>
          </div>
          <p className="opacity-90">Your achievements and rewards</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Stats Overview */}
        <div className="bg-card rounded-2xl p-6 shadow-medium mb-6 animate-scale-in">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">5</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground mb-1">7</div>
              <div className="text-sm text-muted-foreground">Locked</div>
            </div>
          </div>
        </div>

        {/* Featured Achievement */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 shadow-medium mb-6 animate-fade-in-up">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-yellow-500 text-yellow-950 p-3 rounded-xl">
              <Crown className="h-8 w-8" />
            </div>
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-500/20 px-3 py-1 rounded-full uppercase">
              Legendary
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Gold League Champion</h2>
          <p className="text-muted-foreground mb-4">
            Achieved first place in the competitive Gold League with your guild.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg">
              <Camera className="mr-2 h-4 w-4" />
              Celebrate in AR
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">All Achievements</h2>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const rarity = achievement.unlocked ? achievement.rarity : "locked";
              
              return (
                <div
                  key={index}
                  className={`
                    rounded-2xl p-5 border-2 shadow-soft transition-all duration-300
                    ${achievement.unlocked ? 'hover:shadow-medium hover:scale-105 cursor-pointer' : 'opacity-60'}
                    bg-gradient-to-br animate-fade-in
                    ${rarityStyles[rarity as keyof typeof rarityStyles]}
                  `}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="mb-3">
                    <Icon className={`h-10 w-10 ${!achievement.unlocked && 'opacity-30'}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 text-sm">
                    {achievement.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {achievement.description}
                  </p>
                  <p className="text-xs font-medium opacity-70">{achievement.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Store */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Rewards Store</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div>
                <h3 className="font-medium text-foreground text-sm">10% Insurance Discount</h3>
                <p className="text-xs text-muted-foreground">Requires 10,000 points</p>
              </div>
              <Button size="sm" disabled>
                Locked
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
              <div>
                <h3 className="font-medium text-foreground text-sm">Guild Merchandise</h3>
                <p className="text-xs text-muted-foreground">Unlock with guild achievement</p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
              <div>
                <h3 className="font-medium text-foreground text-sm">Premium Workouts</h3>
                <p className="text-xs text-muted-foreground">500 points</p>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Redeem
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
