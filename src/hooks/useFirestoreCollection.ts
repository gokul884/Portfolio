import { useState, useEffect } from 'react';

export function useFirestoreCollection<T>(collectionName: string, fallbackData: T[]): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    // Delay the establishment of the database listener to keep the initial startup path extremely fast
    const timer = setTimeout(async () => {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db, handleFirestoreError, OperationType } = await import('../firebase');
        
        const colRef = collection(db, collectionName);
        
        unsubscribe = onSnapshot(
          colRef,
          (querySnapshot) => {
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
            setData(fallbackData);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn(`Dynamic load of Firestore failed for '${collectionName}':`, err);
        setData(fallbackData);
        setLoading(false);
      }
    }, 2500); // Defer by 2.5 seconds to let initial content render and interactive state settle first

    return () => {
      clearTimeout(timer);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName]);

  return { data, loading };
}

