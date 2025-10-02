import { ArrowLeft, Clock, Target, Play, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const yogaExercises = [
  {
    id: "male-sitting-pose",
    name: "Meditation Pose",
    duration: "5-10 min",
    points: 20,
    difficulty: "Beginner",
    hasModel: true,
    model: "Male Sitting Pose.glb",
    description: "Classic meditation sitting pose for mindfulness and breathing",
    muscleGroups: ["Mind", "Core", "Flexibility"],
    sets: "1 session of 5-10 minutes",
  },
  {
    id: "warrior-pose",
    name: "Warrior Pose",
    duration: "3-5 min",
    points: 25,
    difficulty: "Intermediate",
    hasModel: false,
    description: "Standing pose for strength and balance",
    muscleGroups: ["Legs", "Core", "Balance"],
    sets: "Hold for 30-60 seconds each side",
  },
  {
    id: "downward-dog",
    name: "Downward Dog",
    duration: "2-4 min",
    points: 15,
    difficulty: "Beginner",
    hasModel: false,
    description: "Classic yoga pose for full body stretch",
    muscleGroups: ["Full Body", "Flexibility"],
    sets: "Hold for 30-60 seconds, repeat 3 times",
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    duration: "3-5 min",
    points: 20,
    difficulty: "Intermediate",
    hasModel: false,
    description: "Balance pose for core strength and focus",
    muscleGroups: ["Balance", "Core", "Legs"],
    sets: "Hold for 30 seconds each leg",
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    duration: "2-5 min",
    points: 10,
    difficulty: "Beginner",
    hasModel: false,
    description: "Restorative pose for relaxation and stretching",
    muscleGroups: ["Flexibility", "Relaxation"],
    sets: "Hold for 1-3 minutes",
  },
];

export default function YogaExercises() {
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
      <header className="bg-gradient-to-br from-green-600 to-teal-700 text-white px-6 py-8 animate-fade-in">
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
              <h1 className="text-3xl font-bold">Yoga & Mindfulness</h1>
              <p className="opacity-90">5 exercises • 15-60 min • 30-90 points</p>
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
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">3D Model</span>
                <h2 className="text-xl font-bold text-foreground">Meditation Pose</h2>
              </div>
            </div>
            <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold">
              +20 pts
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Learn proper meditation posture with our 3D demonstration for mindful practice.
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
            size="lg"
            onClick={() => handleExerciseStart("male-sitting-pose", "Male Sitting Pose.glb")}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Meditation
          </Button>
        </div>

        {/* Exercise List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">All Yoga Exercises</h2>
          <div className="space-y-4">
            {yogaExercises.map((exercise, index) => (
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
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full font-semibold">
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
                  className="w-full hover:bg-green-600 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExerciseStart(exercise.id, exercise.model);
                  }}
                >
                  {exercise.hasModel ? (
                    <>
                      <Wind className="mr-2 h-4 w-4" />
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