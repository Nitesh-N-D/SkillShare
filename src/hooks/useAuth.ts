import { useState, useEffect, useCallback, useRef } from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  type AuthError as FirebaseAuthError,
} from "firebase/auth";

import { onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase";

// Ensure a user document exists in Firestore for the authenticated user
async function ensureUserDocument(firebaseUser: import("firebase/auth").User) {
  try {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        displayName: firebaseUser.displayName ?? null,
        photoURL: firebaseUser.photoURL ?? null,
        email: firebaseUser.email ?? null,
        createdAt: Date.now(),
      });
    }
  } catch (err) {
    console.error("ensureUserDocument error:", err);
  }
}

import type { User, AuthError, SignInResult } from "../types/auth";

/* -------------------- HOOK -------------------- */

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const firestoreUnsubRef = useRef<(() => void) | null>(null);
  const googleProviderRef = useRef(new GoogleAuthProvider());

  /* -------------------- HELPERS -------------------- */

  const createAuthError = (err: unknown): AuthError => ({
    code: (err as any)?.code ?? "unknown",
    message: (err as any)?.message ?? "Unexpected error",
    timestamp: Date.now(),
  });

  const clearError = useCallback((delay = 5000) => {
    const timeout = setTimeout(() => setError(null), delay);
    return () => clearTimeout(timeout);
  }, []);

  /* -------------------- FIRESTORE LISTENER -------------------- */

  const setupFirestoreListener = useCallback((uid: string) => {
    const ref = doc(db, "users", uid);

    firestoreUnsubRef.current = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;

        const data = snap.data();

        setUser((prev) =>
          prev
            ? {
                ...prev,
                displayName: data.displayName ?? prev.displayName,
                photoURL: data.photoURL ?? prev.photoURL,
              }
            : null
        );
      },
      (err) => console.error("Firestore listener error:", err)
    );
  }, []);

  const cleanupFirestoreListener = useCallback(() => {
    firestoreUnsubRef.current?.();
    firestoreUnsubRef.current = null;
  }, []);

  /* -------------------- AUTH STATE -------------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          setUser(null);
          cleanupFirestoreListener();
          setLoading(false);
          return;
        }

        // ✅ ENSURE USER DOCUMENT EXISTS (CRITICAL FIX)
        await ensureUserDocument(firebaseUser);

        const mappedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          isAnonymous: firebaseUser.isAnonymous,
          createdAt: firebaseUser.metadata.creationTime ?? undefined,
          lastSignIn: firebaseUser.metadata.lastSignInTime ?? undefined,
        };

        setUser(mappedUser);
        setupFirestoreListener(firebaseUser.uid);
        setLoading(false);
      },
      (err) => {
        setError(createAuthError(err));
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      cleanupFirestoreListener();
    };
  }, [setupFirestoreListener, cleanupFirestoreListener]);

  /* -------------------- ACTIONS -------------------- */

  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    try {
      setLoading(true);
      googleProviderRef.current.setCustomParameters({
        prompt: "select_account",
      });

      const res = await signInWithPopup(auth, googleProviderRef.current);

      return { success: true, user: null, error: null };
    } catch (err) {
      const authErr = createAuthError(err as FirebaseAuthError);
      setError(authErr);
      clearError();
      return { success: false, user: null, error: authErr };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const signInAnon = useCallback(async (): Promise<SignInResult> => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
      return { success: true, user: null, error: null };
    } catch (err) {
      const authErr = createAuthError(err as FirebaseAuthError);
      setError(authErr);
      clearError();
      return { success: false, user: null, error: authErr };
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const logout = useCallback(async (): Promise<SignInResult> => {
    try {
      setLoading(true);
      cleanupFirestoreListener();
      await signOut(auth);
      return { success: true, user: null, error: null };
    } catch (err) {
      const authErr = createAuthError(err as FirebaseAuthError);
      setError(authErr);
      clearError();
      return { success: false, user: null, error: authErr };
    } finally {
      setLoading(false);
    }
  }, [cleanupFirestoreListener, clearError]);

  /* -------------------- RETURN -------------------- */

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInAnon,
    logout,
    clearAuthError: () => setError(null),
    isAuthenticated: !!user && !user.isAnonymous,
    isAnonymous: user?.isAnonymous ?? false,
  };
};
