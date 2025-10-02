import { Trophy, TrendingUp, TrendingDown, Medal, Users, Crown, Heart, Building2, Target, Calendar, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Friends & Family Guild Data
const familyGuildMembers = [
  { name: "Dad", points: 1580, rank: 1, avatar: "👨‍💼", streak: 12, lastActivity: "2h ago" },
  { name: "Mom", points: 1420, rank: 2, avatar: "👩‍⚕️", streak: 8, lastActivity: "4h ago" },
  { name: "You", points: 1245, rank: 3, avatar: "🧑‍💻", streak: 5, lastActivity: "now", isUser: true },
  { name: "Sister", points: 980, rank: 4, avatar: "👩‍🎓", streak: 3, lastActivity: "1d ago" },
  { name: "Brother", points: 875, rank: 5, avatar: "👨‍🎨", streak: 1, lastActivity: "2d ago" },
  { name: "Grandma", points: 650, rank: 6, avatar: "👵", streak: 15, lastActivity: "5h ago" },
];

const familyLeagueStandings = [
  { name: "The Johnson Family", points: 45820, members: 6, trend: "up", rank: 1, isUserGuild: true },
  { name: "The Smith Clan", points: 43200, members: 5, trend: "up", rank: 2 },
  { name: "The Wilson Squad", points: 38940, members: 7, trend: "neutral", rank: 3 },
  { name: "The Brown Brigade", points: 35600, members: 4, trend: "down", rank: 4 },
  { name: "The Davis Dynasty", points: 33200, members: 8, trend: "up", rank: 5 },
  { name: "The Miller Movers", points: 29800, members: 6, trend: "down", rank: 6 },
];

// Corporate & Public Campaigns Data
const corporateCampaigns = [
  {
    id: 1,
    title: "TechCorp Wellness Challenge",
    company: "TechCorp Inc.",
    participants: 1240,
    prize: "$500 Gift Cards",
    duration: "14 days left",
    description: "Company-wide fitness challenge with real rewards",
    joined: false,
    category: "corporate"
  },
  {
    id: 2,
    title: "Downtown Law Firm Steps",
    company: "Johnson & Associates",
    participants: 85,
    prize: "Fitness Equipment",
    duration: "7 days left",
    description: "Step challenge for legal professionals",
    joined: true,
    category: "corporate"
  }
];

const publicCampaigns = [
  {
    id: 3,
    title: "Million Step City Challenge",
    organizer: "City Health Department",
    participants: 15420,
    prize: "Community Gym Memberships",
    duration: "22 days left",
    description: "Help our city reach 1 million collective steps",
    joined: true,
    category: "public",
    progress: 68
  },
  {
    id: 4,
    title: "Heart Health Awareness Month",
    organizer: "American Heart Association",
    participants: 8750,
    prize: "Health Screening Vouchers",
    duration: "30 days left",
    description: "Focus on cardiovascular health activities",
    joined: false,
    category: "public",
    progress: 34
  }
];

export default function Leagues() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-wellness to-primary text-primary-foreground px-6 py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Guild Leagues</h1>
          </div>
          <p className="opacity-90">Compete with family, friends & community</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        <Tabs defaultValue="family" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="family" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Friends & Family
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Corporate & Public
            </TabsTrigger>
          </TabsList>

          {/* Friends & Family Tab */}
          <TabsContent value="family" className="space-y-6">
            {/* Family Guild Status */}
            <div className="bg-gradient-to-r from-heart/10 to-primary/10 border border-primary/30 rounded-2xl p-6 shadow-medium animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">The Johnson Family</h2>
                  <p className="text-sm text-muted-foreground">Bronze League V</p>
                </div>
                <div className="text-center bg-primary/20 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-primary">#1</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly Progress</span>
                  <span className="font-semibold text-foreground">6,750 / 8,000 pts</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold">
                <Crown className="h-4 w-4" />
                <span>Leading the family league!</span>
              </div>
            </div>

            {/* Family Leaderboard */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Medal className="h-5 w-5 text-primary" />
                Family Leaderboard
              </h2>
              <div className="space-y-3">
                {familyGuildMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-3 rounded-xl transition-all duration-300
                      ${member.isUser 
                        ? 'bg-gradient-to-r from-primary/10 to-wellness/10 border border-primary/30' 
                        : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                        ${member.rank === 1 ? 'bg-yellow-500 text-yellow-950' : ''}
                        ${member.rank === 2 ? 'bg-gray-400 text-gray-900' : ''}
                        ${member.rank === 3 ? 'bg-amber-700 text-amber-50' : ''}
                        ${member.rank > 3 ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {member.rank === 1 ? <Crown className="h-5 w-5" /> : member.rank}
                      </div>
                      <div className="text-2xl">{member.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{member.name}</span>
                          {member.isUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>🔥 {member.streak} days</span>
                          <span>Active {member.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{member.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Family League Standings */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Family League Standings</h2>
              <div className="space-y-3">
                {familyLeagueStandings.map((guild, index) => (
                  <div
                    key={index}
                    className={`
                      rounded-2xl p-4 shadow-soft transition-all duration-300 hover:shadow-medium
                      ${guild.isUserGuild 
                        ? 'bg-gradient-to-r from-primary/10 to-wellness/10 border-2 border-primary/30' 
                        : 'bg-card border border-border'
                      }
                      ${guild.rank <= 3 ? 'border-primary/50' : ''}
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
                            <Badge variant="default" className="text-xs">Your Family</Badge>
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
          </TabsContent>

          {/* Corporate & Public Tab */}
          <TabsContent value="public" className="space-y-6">
            {/* Corporate Campaigns */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Corporate Wellness Campaigns
              </h2>
              <div className="space-y-4">
                {corporateCampaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-card rounded-2xl p-5 shadow-soft border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{campaign.company}</p>
                        <p className="text-xs text-muted-foreground">{campaign.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.joined ? (
                          <Badge variant="default" className="bg-primary">
                            <Target className="h-3 w-3 mr-1" />
                            Joined
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">Join</Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {campaign.participants.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {campaign.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Gift className="h-3 w-3" />
                        {campaign.prize}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Health Campaigns */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-wellness" />
                Public Health Campaigns
              </h2>
              <div className="space-y-4">
                {publicCampaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-card rounded-2xl p-5 shadow-soft border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{campaign.organizer}</p>
                        <p className="text-xs text-muted-foreground">{campaign.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.joined ? (
                          <Badge variant="default" className="bg-wellness">
                            <Target className="h-3 w-3 mr-1" />
                            Joined
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">Join</Button>
                        )}
                      </div>
                    </div>
                    
                    {campaign.progress && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Campaign Progress</span>
                          <span className="font-semibold text-wellness">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {campaign.participants.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {campaign.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-wellness font-semibold">
                        <Gift className="h-3 w-3" />
                        {campaign.prize}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion/Demotion Info for Public Leagues */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <Building2 className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Corporate</h3>
                <p className="text-xs text-muted-foreground">Earn real workplace rewards</p>
              </div>
              <div className="bg-wellness/10 border border-wellness/30 rounded-xl p-4">
                <Target className="h-5 w-5 text-wellness mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Public Health</h3>
                <p className="text-xs text-muted-foreground">Make a community impact</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
