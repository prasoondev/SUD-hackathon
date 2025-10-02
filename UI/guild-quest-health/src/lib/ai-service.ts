export interface UserStats {
  steps: number;
  stepGoal: number;
  exerciseMinutes: number;
  exerciseCount: number;
  sleepHours: number;
  hydrationLiters: number;
  hydrationGoal: number;
  mindScore: number;
  wellnessScore: number;
  balance: number;
}

export interface ExerciseRecommendation {
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'hiit';
  points: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

class LocalAIService {
  async generateExerciseRecommendations(userStats: UserStats): Promise<ExerciseRecommendation[]> {
    const recommendations: ExerciseRecommendation[] = [];

    // Cardio recommendation if steps are low
    if (userStats.steps < userStats.stepGoal * 0.7) {
      recommendations.push({
        title: "Power Walk Challenge",
        description: "Boost your daily steps with an energizing 20-minute power walk",
        duration: "20 min",
        difficulty: "beginner",
        type: "cardio",
        points: 40,
        reason: `You're at ${Math.round((userStats.steps / userStats.stepGoal) * 100)}% of your step goal. Let's get moving!`
      });
    }

    // Strength recommendation if exercise minutes are low
    if (userStats.exerciseMinutes < 30) {
      recommendations.push({
        title: "Quick Strength Circuit",
        description: "Full-body strength workout using bodyweight exercises",
        duration: "15 min",
        difficulty: "intermediate",
        type: "strength",
        points: 50,
        reason: `You've exercised ${userStats.exerciseMinutes} min today. Add some strength training!`
      });
    }

    // Mind/flexibility if wellness score is low
    if (userStats.wellnessScore < 80) {
      recommendations.push({
        title: "Mindful Yoga Flow",
        description: "Gentle yoga sequence to improve flexibility and mental wellness",
        duration: "25 min",
        difficulty: "beginner",
        type: "flexibility",
        points: 45,
        reason: `Your wellness score is ${userStats.wellnessScore}. Let's boost it with mindful movement!`
      });
    }

    // HIIT if user seems active
    if (recommendations.length < 3 && userStats.exerciseCount > 0) {
      recommendations.push({
        title: "HIIT Blast",
        description: "High-intensity interval training for maximum calorie burn",
        duration: "12 min",
        difficulty: "advanced",
        type: "hiit",
        points: 60,
        reason: "You're active today! Challenge yourself with this HIIT session."
      });
    }

    // Balance exercise for overall fitness
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Stability & Balance",
        description: "Improve your balance and core strength with targeted exercises",
        duration: "20 min",
        difficulty: "intermediate",
        type: "balance",
        points: 45,
        reason: "Balance training helps prevent injuries and improves overall fitness."
      });
    }

    // Cardio for energy boost
    if (recommendations.length < 3) {
      recommendations.push({
        title: "Energy Boost Cardio",
        description: "Quick cardio session to energize your day",
        duration: "15 min",
        difficulty: "beginner",
        type: "cardio",
        points: 35,
        reason: "A quick cardio session can boost your energy and mood!"
      });
    }

    return recommendations.slice(0, 3);
  }

  async chatWithAI(message: string, userStats: UserStats, chatHistory?: ChatMessage[]): Promise<string> {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      if (userStats.steps < userStats.stepGoal * 0.7) {
        return "I notice you're behind on your step goal today! How about a 15-minute brisk walk? It'll boost your cardio points and get you closer to your daily target. Every step counts toward your guild's success! 🚶‍♂️✨";
      }
      return "Based on your current activity level, I'd recommend mixing things up! Try a combination of strength training and cardio - maybe some bodyweight exercises followed by a short walk. This will help improve both your wellness score and earn you valuable points! 💪";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return `With ${userStats.sleepHours} hours of sleep last night, you're ${userStats.sleepHours >= 7 ? 'doing great' : 'a bit behind'}! ${userStats.sleepHours < 7 ? 'Try to get 7-9 hours tonight.' : 'Keep up the good sleep habits!'} Quality sleep boosts your mind score and overall wellness. Consider a relaxing bedtime routine! 😴`;
    }

    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      const hydrationPercent = Math.round((userStats.hydrationLiters / userStats.hydrationGoal) * 100);
      return `You're at ${hydrationPercent}% of your hydration goal today! ${hydrationPercent < 80 ? 'Try to drink a glass of water right now and set reminders every hour.' : 'Great job staying hydrated!'} Proper hydration improves performance and helps with recovery. 💧`;
    }

    if (lowerMessage.includes('insurance') || lowerMessage.includes('health plan')) {
      return "Many health insurance plans offer wellness programs with rewards for staying active! Check if your plan includes fitness app integrations, gym discounts, or preventive care bonuses. Some plans even reimburse fitness tracker purchases or offer cash rewards for hitting activity goals! 🏥💰";
    }

    if (lowerMessage.includes('points') || lowerMessage.includes('rewards')) {
      return `You currently have ${userStats.balance.toLocaleString()} points! You can earn more by completing daily challenges, hitting your step goals, logging workouts, and maintaining good wellness habits. The more consistent you are, the more points you'll accumulate for your guild! 🏆`;
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('mental')) {
      return `Your current mind score is ${userStats.mindScore}/100. To improve mental wellness, try meditation, deep breathing exercises, or gentle yoga. Taking short breaks throughout the day and practicing gratitude can also boost your mental health score! 🧠✨`;
    }

    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
      return "While I focus on fitness, good nutrition supports your exercise goals! Stay hydrated, eat plenty of fruits and vegetables, and time your meals around your workouts. Many health plans also offer nutrition counseling benefits! 🥗";
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('motivation')) {
      return "Setting small, achievable daily goals is key to long-term success! Focus on consistency rather than perfection. Celebrate small wins, track your progress, and remember that every healthy choice contributes to your guild's overall success! 🎯";
    }

    return "I'm here to help with your health and fitness journey! I can suggest personalized exercises based on your current stats, answer questions about wellness habits, or provide guidance on health insurance benefits. What would you like to focus on today? 🌟";
  }

  // Predefined chat questions
  getPredefinedQuestions(userStats: UserStats): string[] {
    const questions = [
      "What exercises should I do today?",
      "How can I improve my wellness score?",
      "Tips for better sleep quality?",
      "How to stay motivated with fitness?",
      "What health insurance benefits should I know about?",
    ];

    // Add personalized questions based on stats
    if (userStats.steps < userStats.stepGoal * 0.8) {
      questions.unshift("How can I reach my step goal today?");
    }

    if (userStats.hydrationLiters < userStats.hydrationGoal * 0.7) {
      questions.unshift("How much water should I drink daily?");
    }

    if (userStats.mindScore < 70) {
      questions.unshift("How can I improve my mental wellness?");
    }

    return questions.slice(0, 5); // Return max 5 questions
  }
}

export const geminiService = new LocalAIService();