import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  syncFirebaseUserProfile,
  signOutFirebase,
  checkFirebaseRedirectResult,
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize profile from Firestore
  const syncUser = async (fbUser: FirebaseUser): Promise<UserProfile> => {
    const { profile } = await syncFirebaseUserProfile(fbUser);
    setUser(profile);
    setFirebaseUser(fbUser);
    return profile;
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Check if user just returned from a Firebase signInWithRedirect
    checkFirebaseRedirectResult()
      .then(async (redirectUser) => {
        if (redirectUser && isMounted) {
          try {
            await syncUser(redirectUser);
          } catch (err) {
            console.warn('Redirect user sync note:', err);
          }
        }
      })
      .catch((err) => {
        console.warn('Redirect result check note:', err);
      });

    // 2. Main Firebase onAuthStateChanged listener as single source of truth
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (fbUser) {
        try {
          await syncUser(fbUser);
        } catch (err) {
          console.warn('Auth state changed profile sync note:', err);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOutFirebase();
      setUser(null);
      setFirebaseUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (auth.currentUser) {
      const { profile } = await syncFirebaseUserProfile(auth.currentUser);
      setUser(profile);
      return profile;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        logout,
        refreshProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
