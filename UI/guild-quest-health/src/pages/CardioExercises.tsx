import { ArrowLeft, Clock, Zap, Target, Play, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const cardioExercises = [
  {
    id: "situps",
    name: "Sit-ups",
    duration: "3-5 min",
    points: 25,
    difficulty: "Beginner",
    hasAR: true,
    model: "Situps.glb",
    description: "Classic core strengthening exercise with perfect form guidance",
    muscleGroups: ["Core", "Abs"],
    sets: "3 sets of 15-20 reps",
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    duration: "2-4 min",
    points: 20,
    difficulty: "Beginner",
    hasAR: true,
    model: "Jumping Jacks.glb",
    description: "Full-body cardio exercise to get your heart pumping",
    muscleGroups: ["Full Body", "Cardio"],
    sets: "3 sets of 30 seconds",
  },
  {
    id: "burpees",
    name: "Burpees",
    duration: "4-6 min",
    points: 40,
    difficulty: "Advanced",
    hasAR: true,
    model: "Burpee.glb",
    description: "High-intensity full-body exercise for maximum calorie burn",
    muscleGroups: ["Full Body", "Cardio"],
    sets: "3 sets of 8-12 reps",
  },
  {
    id: "boxing",
    name: "Boxing",
    duration: "5-8 min",
    points: 35,
    difficulty: "Intermediate",
    hasAR: true,
    model: "Boxing.glb",
    description: "High-energy boxing workout for cardio and coordination",
    muscleGroups: ["Full Body", "Cardio", "Arms"],
    sets: "3 sets of 2 minutes",
  },
  {
    id: "dancing",
    name: "Dancing",
    duration: "4-7 min",
    points: 30,
    difficulty: "Beginner",
    hasAR: true,
    model: "Dancing.glb",
    description: "Fun dance cardio to improve rhythm and burn calories",
    muscleGroups: ["Full Body", "Cardio"],
    sets: "2-3 songs",
  },
];

export default function CardioExercises() {
  const navigate = useNavigate();

  const handleExerciseStart = (exerciseId: string) => {
    if (exerciseId === "situps") {
      navigate("/exercise/situps");
    } else {
      // For other exercises, use generic exercise page
      const exercise = cardioExercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        navigate(`/exercise/${exerciseId}`, {
          state: {
            model: exercise.model,
            exerciseName: exercise.name,
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-600 to-purple-700 text-white px-6 py-8 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/training")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Cardio Exercises</h1>
              <p className="opacity-90">5 exercises • 20-40 min • 45-85 points</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Featured AR Exercise */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border-2 border-primary/30 shadow-medium mb-6 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">AR Enabled</span>
                <h2 className="text-xl font-bold text-foreground">Sit-ups with AR Coach</h2>
              </div>
            </div>
            <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold">
              +25 pts
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Experience perfect form with our 3D AR instructor. Place the model in your space and follow along!
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
            size="lg"
            onClick={() => handleExerciseStart("situps")}
          >
            <Camera className="mr-2 h-5 w-5" />
            Start AR Training
          </Button>
        </div>

        {/* Exercise List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">All Cardio Exercises</h2>
          <div className="space-y-4">
            {cardioExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleExerciseStart(exercise.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{exercise.name}</h3>
                      {exercise.hasAR && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          AR
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exercise.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {exercise.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{exercise.sets}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-primary">+{exercise.points}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.muscleGroups.map((group, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExerciseStart(exercise.id);
                  }}
                >
                  {exercise.hasAR ? (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Start AR Training
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Exercise
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}