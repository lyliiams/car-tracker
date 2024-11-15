import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { CaptureData } from '../types';

export function useFirestore() {
  const [captures, setCaptures] = useState<CaptureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'captures'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCaptures: CaptureData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<CaptureData, 'id'>;
        newCaptures.push({ ...data, id: doc.id });
      });
      setCaptures(newCaptures);
      setLoading(false);
    }, (err) => {
      console.error('Firestore error:', err);
      setError('Failed to load captures');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCapture = async (blob: Blob, location?: { latitude: number; longitude: number }) => {
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `captures/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // Add document to Firestore
      const captureData = {
        timestamp: Date.now(),
        imageUrl,
        location,
        storagePath: imageRef.fullPath
      };

      await addDoc(collection(db, 'captures'), captureData);
    } catch (err) {
      console.error('Error adding capture:', err);
      throw new Error('Failed to save capture');
    }
  };

  const deleteCapture = async (id: string, storagePath: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'captures', id));
      
      // Delete from Storage
      const imageRef = ref(storage, storagePath);
      await deleteObject(imageRef);
    } catch (err) {
      console.error('Error deleting capture:', err);
      throw new Error('Failed to delete capture');
    }
  };

  return { captures, loading, error, addCapture, deleteCapture };
}