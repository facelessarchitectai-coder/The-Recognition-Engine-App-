import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  collection, 
  query, 
  orderBy, 
  getDocFromServer,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying the firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Error handling types conforming to Firebase skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testConnection(): Promise<boolean> {
  const testPath = "test/connection";
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration: Client is offline.");
    }
    // Non-fatal if connection doc doesn't exist yet, we just wanted to reach the server
    return false;
  }
}

// Data structures
export interface WorkspaceState {
  activeMode: "visual" | "signature" | "fingerprints" | "color";
  screen: "home" | "quiz" | "results";
  refText: string;
  isFacelessCreator: boolean;
  showAdvisory: boolean;
  currentStepIndex: number;
  generatedPhrases: string[];
  generatedFingerprint: {
    emojis: string[];
    explanation: string;
    analysis?: {
      repetition: string;
      themes: string;
      emotionalTone: string;
      visualConsistency: string;
      strongestCombination: string;
    } | null;
  } | null;
  generatedColorWorld: {
    palette: { name: string; hex: string; role: string }[];
    moodLine: string;
  } | null;
  generatedBlueprint: any | null;
  fallbackData?: any | null;
  fallbackErrorMessage?: string;
  updatedAt?: any;
}

export interface SavedCreationItem {
  id: string;
  ownerId: string;
  mode: "visual" | "signature" | "fingerprints" | "color";
  title: string;
  refText: string;
  isFacelessCreator: boolean;
  generatedPhrases?: string[];
  generatedFingerprint?: any;
  generatedColorWorld?: any;
  generatedBlueprint?: any;
  createdAt: string;
  updatedAt: string;
}

// User Profile sync
export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Workspace Persistence (Auto-saving active work)
export async function saveWorkspaceToFirestore(userId: string, data: WorkspaceState): Promise<void> {
  const path = `users/${userId}/workspaces/active`;
  try {
    const docRef = doc(db, "users", userId, "workspaces", "active");
    await setDoc(docRef, {
      id: "active",
      ownerId: userId,
      activeMode: data.activeMode,
      screen: data.screen,
      refText: (data.refText || "").slice(0, 15000), // Enforce length boundary
      isFacelessCreator: Boolean(data.isFacelessCreator),
      showAdvisory: Boolean(data.showAdvisory),
      currentStepIndex: data.currentStepIndex || 0,
      generatedPhrases: data.generatedPhrases || [],
      generatedFingerprint: data.generatedFingerprint || null,
      generatedColorWorld: data.generatedColorWorld || null,
      generatedBlueprint: data.generatedBlueprint || null,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Load workspace from Firestore
export async function loadWorkspaceFromFirestore(userId: string): Promise<WorkspaceState | null> {
  const path = `users/${userId}/workspaces/active`;
  try {
    const docRef = doc(db, "users", userId, "workspaces", "active");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    const raw = snapshot.data();
    return {
      activeMode: raw.activeMode || "visual",
      screen: raw.screen || "home",
      refText: raw.refText || "",
      isFacelessCreator: Boolean(raw.isFacelessCreator),
      showAdvisory: raw.showAdvisory !== undefined ? Boolean(raw.showAdvisory) : true,
      currentStepIndex: raw.currentStepIndex || 0,
      generatedPhrases: raw.generatedPhrases || [],
      generatedFingerprint: raw.generatedFingerprint || null,
      generatedColorWorld: raw.generatedColorWorld || null,
      generatedBlueprint: raw.generatedBlueprint || null,
      updatedAt: raw.updatedAt,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Save Completed Creation to Library
export async function saveCreationToFirestore(userId: string, creation: Omit<SavedCreationItem, "id" | "ownerId" | "createdAt" | "updatedAt">): Promise<string> {
  const creationId = "creation_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
  const path = `users/${userId}/creations/${creationId}`;
  try {
    const docRef = doc(db, "users", userId, "creations", creationId);
    const nowIso = new Date().toISOString();
    const item: SavedCreationItem = {
      ...creation,
      id: creationId,
      ownerId: userId,
      title: creation.title ? creation.title.slice(0, 200) : `${creation.mode.toUpperCase()} Creation`,
      refText: (creation.refText || "").slice(0, 15000),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    await setDoc(docRef, item);
    return creationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Load user's saved creations library
export async function loadCreationsFromFirestore(userId: string): Promise<SavedCreationItem[]> {
  const path = `users/${userId}/creations`;
  try {
    const creationsRef = collection(db, "users", userId, "creations");
    const snapshot = await getDocs(creationsRef);
    const list: SavedCreationItem[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as SavedCreationItem);
    });
    // Sort descending by createdAt
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Delete a saved creation
export async function deleteCreationFromFirestore(userId: string, creationId: string): Promise<void> {
  const path = `users/${userId}/creations/${creationId}`;
  try {
    const docRef = doc(db, "users", userId, "creations", creationId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(result.user);
  return result.user;
}

// Sign-out
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
