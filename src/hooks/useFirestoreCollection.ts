import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export function useFirestoreCollection<T>(collectionName: string, fallbackData: T[]): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const colRef = collection(db, collectionName);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
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

    return () => {
      unsubscribe();
    };
  }, [collectionName, fallbackData]);

  return { data, loading };
}
