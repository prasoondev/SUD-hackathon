import { ArrowLeft, RotateCcw, Award, Timer, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function GenericExercise() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();
  const location = useLocation();
  const [isExercising, setIsExercising] = useState(false);
  const [reps, setReps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [formScore, setFormScore] = useState(0);
  const modelViewerRef = useRef<any>(null);

  // Get model and exercise name from location state
  const model = location.state?.model || "Situps.glb";
  const exerciseName = location.state?.exerciseName || exerciseId || "Exercise";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercising) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExercising]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      const handleLoad = () => {
        console.log('Model loaded successfully');
      };

      const handleError = (event: any) => {
        console.error('Model loading error:', event);
      };

      modelViewer.addEventListener('load', handleLoad);
      modelViewer.addEventListener('error', handleError);

      return () => {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
      };
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startExercise = () => {
    setIsExercising(true);
    setTimer(0);
    setReps(0);
    setFormScore(0);
  };

  const stopExercise = () => {
    setIsExercising(false);
    // Simulate form score calculation
    setFormScore(Math.floor(Math.random() * 30) + 70); // Random score between 70-100
  };

  const resetExercise = () => {
    setIsExercising(false);
    setTimer(0);
    setReps(0);
    setFormScore(0);
  };

  const addRep = () => {
    if (isExercising) {
      setReps(prev => prev + 1);
    }
  };

  const getExerciseCategory = () => {
    // Determine category based on model name for navigation
    const cardioModels = ["Situps.glb", "Jumping Jacks.glb", "Burpee.glb", "Boxing.glb", "Dancing.glb"];
    const strengthModels = ["Jump Push Up.glb", "Start Plank.glb", "Mma Kick.glb"];
    const yogaModels = ["Male Sitting Pose.glb"];
    
    if (cardioModels.includes(model)) return "/training/cardio";
    if (strengthModels.includes(model)) return "/training/strength";
    if (yogaModels.includes(model)) return "/training/yoga";
    return "/training";
  };

  const formatExerciseName = (name: string) => {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
              onClick={() => navigate(getExerciseCategory())}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{formatExerciseName(exerciseName)}</h1>
              <p className="opacity-90">3D form coach & exercise tracker</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* 3D Model Viewer */}
        <div className="bg-card rounded-2xl shadow-lg mb-6 overflow-hidden animate-scale-in">
          <div className="relative aspect-video">
            <model-viewer
              ref={modelViewerRef}
              src={`/${model}`}
              camera-controls
              touch-action="pan-y"
              autoplay
              shadow-intensity="1"
              auto-rotate
              max-camera-orbit="auto 90deg auto"
              alt={`3D model of a character doing ${exerciseName}`}
              className="w-full h-full bg-gradient-to-br from-muted/5 to-muted/10"
              style={{ width: '100%', height: '100%', minHeight: '350px' }}
            ></model-viewer>
          </div>
          
          {/* Model Controls */}
          <div className="p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">3D Form Coach</h3>
                <p className="text-sm text-muted-foreground">Rotate, zoom, and study the perfect form</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (modelViewerRef.current) {
                      modelViewerRef.current.autoRotate = !modelViewerRef.current.autoRotate;
                    }
                  }}
                >
                  Auto Rotate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (modelViewerRef.current) {
                      modelViewerRef.current.resetTurntableRotation();
                    }
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary">{reps}</div>
            <div className="text-sm text-muted-foreground">Reps</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{formatTime(timer)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{formScore}%</div>
            <div className="text-sm text-muted-foreground">Form</div>
          </div>
        </div>

        {/* Exercise Controls */}
        <div className="bg-card rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Exercise Control
          </h3>
          
          <div className="flex gap-3 mb-4">
            {!isExercising ? (
              <Button 
                onClick={startExercise}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Exercise
              </Button>
            ) : (
              <Button 
                onClick={stopExercise}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Pause className="mr-2 h-5 w-5" />
                Stop Exercise
              </Button>
            )}
            
            <Button 
              onClick={resetExercise}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Simulate Rep Counter */}
          {isExercising && (
            <Button 
              onClick={addRep}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Count Rep (+1)
            </Button>
          )}
        </div>

        {/* Completion Card */}
        {formScore > 0 && !isExercising && (
          <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl p-6 border-2 border-primary/30 shadow-lg mb-6 animate-fade-in">
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">Excellent Work!</h3>
              <p className="text-muted-foreground mb-4">
                You completed {reps} reps in {formatTime(timer)} with {formScore}% form accuracy
              </p>
              <div className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-lg font-bold inline-block">
                +{Math.floor(reps * 2.5)} points earned
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}