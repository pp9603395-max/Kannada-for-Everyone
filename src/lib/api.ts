import {
  Lesson,
  VocabularyItem,
  RoleplayScenario,
  CulturalItem,
  UserProgress,
  UserProfile,
  ExplanationLanguage,
  UserLevel,
  AIRoleplayResponse,
} from '../types';

import { auth } from './firebase';

async function getHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }
    } catch (err) {
      console.warn('Failed to retrieve Firebase ID token:', err);
    }
  }

  return headers;
}

export const api = {
  // Lessons
  async getLessons(): Promise<Lesson[]> {
    const res = await fetch('/api/lessons', { headers: await getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async getLessonById(id: string): Promise<Lesson | null> {
    const res = await fetch(`/api/lessons/${id}`, { headers: await getHeaders() });
    const json = await res.json();
    return json.data || null;
  },

  // Vocabulary (165+ items)
  async getVocabulary(params?: {
    category?: string;
    search?: string;
    level?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: VocabularyItem[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.level) query.set('level', params.level);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));

    const res = await fetch(`/api/vocabulary?${query.toString()}`, {
      headers: await getHeaders(),
    });
    const json = await res.json();
    return {
      items: json.data || [],
      total: json.total || (json.data ? json.data.length : 0),
    };
  },

  // Roleplay Scenarios
  async getConversations(): Promise<RoleplayScenario[]> {
    const res = await fetch('/api/conversations', { headers: await getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  // Cultural Catalogue (32+ entries)
  async getCulture(params?: {
    category?: string;
    search?: string;
    unescoOnly?: boolean;
  }): Promise<{ items: CulturalItem[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.unescoOnly) query.set('unescoOnly', 'true');

    const res = await fetch(`/api/culture?${query.toString()}`, {
      headers: await getHeaders(),
    });
    const json = await res.json();
    return {
      items: json.data || [],
      total: json.total || (json.data ? json.data.length : 0),
    };
  },

  // Daily Phrase
  async getDailyPhrase(): Promise<any> {
    const res = await fetch('/api/daily-phrase', { headers: await getHeaders() });
    const json = await res.json();
    return json.data || null;
  },

  // User Progress
  async getProgress(): Promise<UserProgress | null> {
    const res = await fetch('/api/progress', { headers: await getHeaders() });
    const json = await res.json();
    return json.data || null;
  },

  async completeLesson(lessonId: string): Promise<any> {
    const res = await fetch('/api/progress/complete', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ lessonId }),
    });
    const json = await res.json();
    return json.data;
  },

  async submitQuiz(quizId: string, score: number, total: number): Promise<any> {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ quizId, score, total }),
    });
    const json = await res.json();
    return json.data;
  },

  async recordActivity(type: 'roleplay' | 'vocabulary' | 'pronunciation', title: string, points?: number): Promise<any> {
    const res = await fetch('/api/activity/record', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ type, title, points: points || 5 }),
    });
    const json = await res.json();
    return json.data;
  },

  // Saved Vocabulary
  async getSavedVocabulary(): Promise<VocabularyItem[]> {
    const res = await fetch('/api/vocabulary/saved', { headers: await getHeaders() });
    const json = await res.json();
    return json.data || [];
  },

  async toggleSavedWord(wordId: string): Promise<{ isSaved: boolean; savedWordIds: string[] }> {
    const res = await fetch('/api/vocabulary/saved', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ wordId }),
    });
    const json = await res.json();
    return json.data;
  },

  // AI Chat (Bilingual)
  async chatAI(payload: {
    scenarioContext: string;
    history: any[];
    message: string;
    preferredLanguage: ExplanationLanguage;
  }): Promise<AIRoleplayResponse> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return json.data;
  },

  // Auth profile (Firebase Authentication handles sign-in/sign-out on the client)
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const res = await fetch('/api/auth/me', { headers: await getHeaders() });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data?.user || null;
    } catch {
      return null;
    }
  },

  // Health
  async getDbHealth(): Promise<any> {
    const res = await fetch('/api/health/db');
    return res.json();
  },
};
