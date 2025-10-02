import { ArrowLeft, Clock, Target, Play, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const strengthExercises = [
  {
    id: "jump-push-up",
    name: "Jump Push Up",
    duration: "4-6 min",
    points: 40,
    difficulty: "Advanced",
    hasModel: true,
    model: "Jump Push Up.glb",
    description: "Explosive push-up variation for upper body power",
    muscleGroups: ["Chest", "Arms", "Core"],
    sets: "3 sets of 8-12 reps",
  },
  {
    id: "plank",
    name: "Plank",
    duration: "3-5 min",
    points: 25,
    difficulty: "Beginner",
    hasModel: true,
    model: "Start Plank.glb",
    description: "Core strengthening isometric hold exercise",
    muscleGroups: ["Core", "Shoulders"],
    sets: "3 sets of 30-60 seconds",
  },
  {
    id: "mma-kick",
    name: "MMA Kick",
    duration: "5-7 min",
    points: 35,
    difficulty: "Intermediate",
    hasModel: true,
    model: "Mma Kick.glb",
    description: "Martial arts kick for leg strength and balance",
    muscleGroups: ["Legs", "Core", "Glutes"],
    sets: "3 sets of 10 reps each leg",
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    duration: "3-5 min",
    points: 20,
    difficulty: "Beginner",
    hasModel: false,
    description: "Lower body strengthening exercise",
    muscleGroups: ["Legs", "Glutes"],
    sets: "3 sets of 15-20 reps",
  },
  {
    id: "lunges",
    name: "Lunges",
    duration: "4-6 min",
    points: 25,
    difficulty: "Intermediate",
    hasModel: false,
    description: "Unilateral leg strengthening exercise",
    muscleGroups: ["Legs", "Glutes", "Core"],
    sets: "3 sets of 12 reps each leg",
  },
];

export default function StrengthExercises() {
  const navigate = useNavigate();

  const handleExerciseStart = (exerciseId: string, model?: string) => {
    if (model) {
      navigate(`/exercise/${exerciseId}`, { state: { model, exerciseName: exerciseId } });
    } else {
      console.log(`Starting ${exerciseId} - Coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-600 to-red-700 text-white px-6 py-8 animate-fade-in">
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
              <h1 className="text-3xl font-bold">Strength Training</h1>
              <p className="opacity-90">5 exercises • 20-45 min • 50-100 points</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Featured Exercise */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 border-2 border-primary/30 shadow-medium mb-6 animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">3D Model</span>
                <h2 className="text-xl font-bold text-foreground">Jump Push Up</h2>
              </div>
            </div>
            <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold">
              +40 pts
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Master the explosive jump push-up with our 3D form demonstration.
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
            size="lg"
            onClick={() => handleExerciseStart("jump-push-up", "Jump Push Up.glb")}
          >
            <Play className="mr-2 h-5 w-5" />
            Start 3D Training
          </Button>
        </div>

        {/* Exercise List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">All Strength Exercises</h2>
          <div className="space-y-4">
            {strengthExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleExerciseStart(exercise.id, exercise.model)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">{exercise.name}</h3>
                      {exercise.hasModel && (
                        <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-semibold">
                          3D
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
                  className="w-full hover:bg-orange-600 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExerciseStart(exercise.id, exercise.model);
                  }}
                >
                  {exercise.hasModel ? (
                    <>
                      <Dumbbell className="mr-2 h-4 w-4" />
                      View 3D Demo
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