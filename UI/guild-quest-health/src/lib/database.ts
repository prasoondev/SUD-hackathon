export interface User {
  userid: string;
  email: string;
  username: string;
  phone_number: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
  phone_number: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

class DatabaseService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async createUser(userData: UserCreate): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create user' };
      }

      // Store the token
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async loginUser(loginData: UserLogin): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }

      // Store the token
      if (data.token) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error logging in user:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getUserById(userid: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userid}`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.token) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/user/profile`, {
        headers: this.getHeaders(true),
      });

      if (!response.ok) {
        // Token might be expired, clear it
        this.logout();
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async updateProfile(updates: Partial<Pick<User, 'username' | 'name' | 'phone_number'>>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      if (!this.token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${this.baseUrl}/user/profile`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getBalance(): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/blockchain/balance`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch balance' };
      }

      return { success: true, balance: data.balance };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Daily Objectives methods
  async getDailyObjectives(): Promise<{ success: boolean; objectives?: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/objectives/daily`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch daily objectives' };
      }

      return { success: true, objectives: data.objectives };
    } catch (error) {
      console.error('Error fetching daily objectives:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async claimObjectiveReward(objectiveId: number): Promise<{ success: boolean; message?: string; newBalance?: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/objectives/claim/${objectiveId}`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to claim objective reward' };
      }

      return { success: true, message: data.message, newBalance: data.new_balance };
    } catch (error) {
      console.error('Error claiming objective reward:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updateObjectiveProgress(objectiveId: number, progress: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/objectives/progress`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ objectiveId, progress }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update objective progress' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating objective progress:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Achievements methods
  async getAchievements(): Promise<{ success: boolean; achievements?: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/achievements`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to fetch achievements' };
      }

      return { success: true, achievements: data.achievements };
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async unlockAchievement(achievementId: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/achievements/unlock/${achievementId}`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to unlock achievement' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async claimAchievementReward(achievementId: number): Promise<{ success: boolean; message?: string; newBalance?: number; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/achievements/claim/${achievementId}`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to claim achievement reward' };
      }

      return { success: true, message: data.message, newBalance: data.new_balance };
    } catch (error) {
      console.error('Error claiming achievement reward:', error);
      return { success: false, error: 'Network error' };
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const dbService = new DatabaseService();