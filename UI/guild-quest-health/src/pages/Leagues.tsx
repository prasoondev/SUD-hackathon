import { Trophy, TrendingUp, TrendingDown, Medal, Users, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const leagueStandings = [
  { name: "Fitness Warriors", points: 45820, members: 15, trend: "up", rank: 1 },
  { name: "Wellness Champions", points: 43200, members: 12, trend: "up", rank: 2 },
  { name: "The Active Avengers", points: 38940, members: 12, trend: "neutral", rank: 3, isUserGuild: true },
  { name: "Health Heroes", points: 35600, members: 10, trend: "down", rank: 4 },
  { name: "Power Squad", points: 33200, members: 14, trend: "up", rank: 5 },
  { name: "Cardio Crew", points: 29800, members: 11, trend: "down", rank: 6 },
];

const guildMembers = [
  { name: "Sarah (You)", points: 1245, rank: 3 },
  { name: "Marcus", points: 1580, rank: 1 },
  { name: "Emma", points: 1320, rank: 2 },
  { name: "Alex", points: 980, rank: 4 },
  { name: "Jordan", points: 875, rank: 5 },
];

export default function Leagues() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-wellness to-primary text-primary-foreground px-6 py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Bronze League V</h1>
          </div>
          <p className="opacity-90">Week 3 of 4 • Top 3 promoted</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* League Progress */}
        <div className="bg-card rounded-2xl p-6 shadow-medium mb-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Your Guild's Position</h2>
              <p className="text-sm text-muted-foreground">The Active Avengers</p>
            </div>
            <div className="text-center bg-primary/10 rounded-xl px-4 py-2">
              <div className="text-2xl font-bold text-primary">#3</div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Points to #2</span>
              <span className="font-semibold text-foreground">-4,260 pts</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Keep pushing for promotion!</span>
          </div>
        </div>

        {/* League Standings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">League Standings</h2>
          <div className="space-y-3">
            {leagueStandings.map((guild, index) => (
              <div
                key={index}
                className={`
                  rounded-2xl p-4 shadow-soft transition-all duration-300 hover:shadow-medium
                  ${guild.isUserGuild 
                    ? 'bg-gradient-to-r from-primary/10 to-wellness/10 border-2 border-primary/30' 
                    : 'bg-card border border-border'
                  }
                  ${guild.rank <= 3 ? 'border-primary/50' : ''}
                  ${guild.rank > leagueStandings.length - 3 ? 'border-destructive/30' : ''}
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${guild.rank === 1 ? 'bg-yellow-500 text-yellow-950' : ''}
                    ${guild.rank === 2 ? 'bg-gray-400 text-gray-900' : ''}
                    ${guild.rank === 3 ? 'bg-amber-700 text-amber-50' : ''}
                    ${guild.rank > 3 ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {guild.rank === 1 && <Crown className="h-5 w-5" />}
                    {guild.rank !== 1 && guild.rank}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{guild.name}</h3>
                      {guild.isUserGuild && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Your Guild
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {guild.members}
                      </span>
                      <span className="font-semibold text-foreground">
                        {guild.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>

                  <div>
                    {guild.trend === "up" && <TrendingUp className="h-5 w-5 text-primary" />}
                    {guild.trend === "down" && <TrendingDown className="h-5 w-5 text-destructive" />}
                    {guild.trend === "neutral" && <div className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guild Leaderboard */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            Guild Members
          </h2>
          <div className="space-y-3">
            {guildMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${member.rank <= 3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    {member.rank}
                  </div>
                  <span className="font-medium text-foreground">{member.name}</span>
                </div>
                <span className="font-semibold text-primary">{member.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion/Demotion Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <TrendingUp className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">Promotion</h3>
            <p className="text-xs text-muted-foreground">Top 3 guilds advance</p>
          </div>
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <TrendingDown className="h-5 w-5 text-destructive mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">Demotion</h3>
            <p className="text-xs text-muted-foreground">Bottom 3 drop down</p>
          </div>
        </div>
      </div>
    </div>
  );
}
