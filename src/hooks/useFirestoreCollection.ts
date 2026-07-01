import { useState, useEffect } from 'react';

// Shared event emitter or active state for interaction
let interacted = false;
const listeners = new Set<() => void>();

function handleInteraction() {
  if (interacted) return;
  interacted = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
  cleanup();
}

function cleanup() {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleInteraction);
    window.removeEventListener('touchstart', handleInteraction);
    window.removeEventListener('pointerdown', handleInteraction);
    window.removeEventListener('keydown', handleInteraction);
  }
}

if (typeof window !== 'undefined') {
  const isAdmin = window.location.pathname.includes('/admin') || window.location.hash.includes('admin');
  if (isAdmin) {
    interacted = true;
  } else {
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
  }
}

export function registerFirestoreLoad(cb: () => void): () => void {
  if (interacted) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useFirestoreCollection<T>(
  collectionName: string, 
  fallbackData: T[],
  options: { enabled?: boolean } = { enabled: true }
): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState<boolean>(true);

  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (enabled === false) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const startFirestore = async () => {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db, handleFirestoreError, OperationType } = await import('../firebase');
        
        if (!isMounted) return;

        const colRef = collection(db, collectionName);
        
        unsubscribe = onSnapshot(
          colRef,
          (querySnapshot) => {
            if (!isMounted) return;
            if (!querySnapshot.empty) {
              const fetchedData: T[] = [];
              querySnapshot.forEach((doc) => {
                const docData = doc.data();
                fetchedData.push({
                  id: doc.id,
                  ...docData,
                } as unknown as T);
              });
              setData(fetchedData);
            } else {
              // Collection is empty in Firestore, use fallback data
              setData(fallbackData);
            }
            setLoading(false);
          },
          (error) => {
            console.warn(`Firestore subscription failed for '${collectionName}'. Falling back to local data.`);
            try {
              handleFirestoreError(error, OperationType.LIST, collectionName);
            } catch (e) {
              // Catch and handle
            }
            if (isMounted) {
              setData(fallbackData);
              setLoading(false);
            }
          }
        );
      } catch (err) {
        console.warn(`Dynamic load of Firestore failed for '${collectionName}':`, err);
        if (isMounted) {
          setData(fallbackData);
          setLoading(false);
        }
      }
    };

    const unsubscribeInteract = registerFirestoreLoad(() => {
      startFirestore();
    });

    return () => {
      isMounted = false;
      unsubscribeInteract();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, enabled]);

  return { data, loading };
}
