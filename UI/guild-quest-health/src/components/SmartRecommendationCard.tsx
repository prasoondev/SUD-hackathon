import React from 'react';
import { Sparkles, Loader2, Dumbbell, Heart, Zap, Brain, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExerciseRecommendation } from '@/lib/ai-service';

interface SmartRecommendationCardProps {
  recommendation: ExerciseRecommendation;
  onStart?: () => void;
  isLoading?: boolean;
}

const typeIcons = {
  cardio: Heart,
  strength: Dumbbell,
  flexibility: Target,
  balance: Brain,
  hiit: Zap,
};

const typeStyles = {
  cardio: "border-red-200 hover:border-red-300 bg-red-50/50",
  strength: "border-blue-200 hover:border-blue-300 bg-blue-50/50",
  flexibility: "border-green-200 hover:border-green-300 bg-green-50/50",
  balance: "border-purple-200 hover:border-purple-300 bg-purple-50/50",
  hiit: "border-orange-200 hover:border-orange-300 bg-orange-50/50",
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export function SmartRecommendationCard({
  recommendation,
  onStart,
  isLoading = false,
}: SmartRecommendationCardProps) {
  const IconComponent = typeIcons[recommendation.type];

  if (isLoading) {
    return (
      <div className="min-w-[300px] snap-center rounded-2xl border-2 border-dashed border-muted p-6 shadow-soft animate-pulse">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Generating personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-[300px] snap-center rounded-2xl border-2 p-5 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 relative",
        typeStyles[recommendation.type]
      )}
    >
      {/* Smart Badge */}
      <div className="absolute -top-2 -right-2">
        <Badge variant="secondary" className="bg-primary text-primary-foreground">
          <Sparkles className="h-3 w-3 mr-1" />
          Smart
        </Badge>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-xl",
          recommendation.type === 'cardio' && "text-red-600 bg-red-100",
          recommendation.type === 'strength' && "text-blue-600 bg-blue-100",
          recommendation.type === 'flexibility' && "text-green-600 bg-green-100",
          recommendation.type === 'balance' && "text-purple-600 bg-purple-100",
          recommendation.type === 'hiit' && "text-orange-600 bg-orange-100"
        )}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">+{recommendation.points}</div>
          <div className="text-xs text-muted-foreground">points</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge 
          variant="outline" 
          className={cn("text-xs", difficultyColors[recommendation.difficulty])}
        >
          {recommendation.difficulty}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {recommendation.duration}
        </Badge>
      </div>

      <h3 className="font-semibold text-foreground mb-2">{recommendation.title}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {recommendation.description}
      </p>

      {/* Smart Reason */}
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {recommendation.reason}
          </p>
        </div>
      </div>

      <Button
        onClick={onStart}
        variant="outline"
        className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Start Workout
      </Button>
    </div>
  );
}