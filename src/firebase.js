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

// Configuração oficial do Firebase para Alberto & Liesa
export const firebaseConfig = {
  apiKey: "AIzaSyBCUfbXDZss5-9vsHz-y7mh-PLfjq-bd2g",
  authDomain: "alberto-e-liesa.firebaseapp.com",
  projectId: "alberto-e-liesa",
  storageBucket: "alberto-e-liesa.firebasestorage.app",
  messagingSenderId: "943796554139",
  appId: "1:943796554139:web:2dc1ce59f701b20861f93e",
  measurementId: "G-CCML3HQB9E"
};

// Inicialização do Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const isFirebaseReady = true;

console.log("🔥 Firebase Firestore conectado com sucesso para Alberto & Liesa!");

export { db, isFirebaseReady };

// 1. Guardar Confirmação de Presença (RSVP) no Firestore
export async function saveRsvpToFirestore(rsvpData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'rsvps'), {
      ...rsvpData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao guardar RSVP no Firebase Firestore:", err);
    throw err;
  }
}

// 2. Ouvir Confirmações em Tempo Real para o Painel Admin
export function subscribeToRsvps(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const rsvps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rsvps);
  }, (err) => {
    console.error("Erro na sincronização do Firebase RSVP:", err);
    callback([]);
  });
}

// 3. Eliminar Confirmação do Firestore
export async function deleteRsvpFromFirestore(id) {
  if (!db || !id) return;
  try {
    await deleteDoc(doc(db, 'rsvps', id));
  } catch (err) {
    console.error("Erro ao eliminar RSVP no Firebase:", err);
    throw err;
  }
}

// 4. Guardar Mensagem no Mural
export async function saveMessageToFirestore(messageData) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      createdDate: new Date().toLocaleString('pt-MZ')
    });
    return docRef.id;
  } catch (err) {
    console.error("Erro ao guardar mensagem no Firebase:", err);
    throw err;
  }
}

// 5. Ouvir Mensagens do Mural em Tempo Real
export function subscribeToMessages(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (err) => {
    console.error("Erro na sincronização de Mensagens do Firebase:", err);
    callback([]);
  });
}
