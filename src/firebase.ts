import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Your web app's Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCBL4AlzYhbFaD7b5F3Et11OpnbOGGKa7w",
  authDomain: "portfolio-cacf5.firebaseapp.com",
  projectId: "portfolio-cacf5",
  storageBucket: "portfolio-cacf5.firebasestorage.app",
  messagingSenderId: "260254138182",
  appId: "1:260254138182:web:f5c75df77c18bd2ceaef47",
  measurementId: "G-NYPV9H8ZKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export
export const db = getFirestore(app);

// Error handling types and helper as specified by the Firebase skill guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  
  if (operationType === OperationType.GET || operationType === OperationType.LIST) {
    console.warn('Firestore Read Warning (falling back to local data):', JSON.stringify(errInfo));
  } else {
    console.error('Firestore Error Details:', JSON.stringify(errInfo));
  }
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation deferred to run after load to prevent blocking main-thread startup
async function testConnection() {
  try {
    // Attempt to pull a single document from a allowed path (settings) to verify connection without triggering permissions error
    await getDocFromServer(doc(db, 'settings', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your internet or Firebase configuration. The client is offline.");
    }
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    setTimeout(testConnection, 3000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(testConnection, 3000);
    });
  }
}

