import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// =========================================================================
// 1. DEDICATED CLOUD STORAGE ENGINE - ALBERTO & LIESA
// =========================================================================
const MASTER_CLOUD_ID = 'ff808181a09d98f701a107370ec873c2';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${MASTER_CLOUD_ID}`;

let memoryCache = {
  rsvps: [],
  messages: []
};

async function fetchCloudStore() {
  try {
    const res = await fetch(CLOUD_API_URL, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        memoryCache = {
          ...memoryCache,
          ...json.data
        };
        return memoryCache;
      }
    }
  } catch (err) {
    console.warn('Cloud store fetch warning:', err.message);
  }
  return memoryCache;
}

async function updateCloudStore(partialData) {
  try {
    const current = await fetchCloudStore();
    const updated = {
      ...current,
      ...partialData
    };
    memoryCache = updated;

    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alberto e Liesa Wedding Cloud Database',
        data: updated
      })
    });
    return updated;
  } catch (err) {
    console.warn('Cloud store update warning:', err.message);
    return memoryCache;
  }
}

// =========================================================================
// 2. FIREBASE FIRESTORE CONFIGURATION (Alberto & Liesa)
// =========================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyBCUfbXDZss5-9vsHz-y7mh-PLfjq-bd2g",
  authDomain: "alberto-e-liesa.firebaseapp.com",
  projectId: "alberto-e-liesa",
  storageBucket: "alberto-e-liesa.firebasestorage.app",
  messagingSenderId: "943796554139",
  appId: "1:943796554139:web:2dc1ce59f701b20861f93e",
  measurementId: "G-CCML3HQB9E"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.log('Firebase init notice:', e.message);
}

const isFirebaseReady = true;
export { db, isFirebaseReady };

// =========================================================================
// 3. RSVP CONFIRMATIONS (Alberto & Liesa)
// =========================================================================

export async function saveRsvpToFirestore(rsvpData) {
  const rsvpId = `rsvp-alberto-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const item = {
    id: rsvpId,
    ...rsvpData,
    createdDate: new Date().toLocaleString('pt-MZ')
  };

  try {
    const current = await fetchCloudStore();
    const existing = current.rsvps || [];
    const updatedRsvps = [item, ...existing.filter(r => r.name !== item.name || r.id !== item.id)];
    await updateCloudStore({ rsvps: updatedRsvps });
  } catch (e) {
    console.warn('Error saving RSVP to Cloud Store:', e);
  }

  if (db) {
    try {
      await addDoc(collection(db, 'rsvps'), {
        ...rsvpData,
        createdAt: serverTimestamp(),
        createdDate: new Date().toLocaleString('pt-MZ')
      });
    } catch (err) {}
  }

  return rsvpId;
}

export function subscribeToRsvps(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    const rsvps = store.rsvps || [];
    callback(rsvps);
  };

  pullLatest();
  const interval = setInterval(pullLatest, 3000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}

export async function deleteRsvpFromFirestore(id) {
  if (!id) return;

  try {
    const current = await fetchCloudStore();
    const updated = (current.rsvps || []).filter(r => r.id !== id);
    await updateCloudStore({ rsvps: updated });
  } catch (e) {
    console.warn('Error deleting RSVP from Cloud Store:', e);
  }

  if (db) {
    try {
      await deleteDoc(doc(db, 'rsvps', id));
    } catch (err) {}
  }
}

// =========================================================================
// 4. MESSAGE WALL (Alberto & Liesa)
// =========================================================================

export async function saveMessageToFirestore(messageData) {
  const msgId = `msg-alberto-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const item = {
    id: msgId,
    ...messageData,
    createdDate: new Date().toLocaleString('pt-MZ')
  };

  try {
    const current = await fetchCloudStore();
    const existing = current.messages || [];
    const updatedMessages = [item, ...existing];
    await updateCloudStore({ messages: updatedMessages });
  } catch (e) {
    console.warn('Error saving message to Cloud Store:', e);
  }

  if (db) {
    try {
      await addDoc(collection(db, 'messages'), {
        ...messageData,
        createdAt: serverTimestamp(),
        createdDate: new Date().toLocaleString('pt-MZ')
      });
    } catch (err) {}
  }

  return msgId;
}

export function subscribeToMessages(callback) {
  let isMounted = true;

  const pullLatest = async () => {
    if (!isMounted) return;
    const store = await fetchCloudStore();
    const messages = store.messages || [];
    callback(messages);
  };

  pullLatest();
  const interval = setInterval(pullLatest, 4000);

  const handleFocus = () => pullLatest();
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleFocus);

  return () => {
    isMounted = false;
    clearInterval(interval);
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleFocus);
  };
}
