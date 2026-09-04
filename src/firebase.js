import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

// Configuração do Firebase para Alberto & Liesa
// Pode colar as credenciais oficiais do seu projeto Firebase Console aqui
export const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyReplaceWithYours",
  authDomain: "alberto-e-liesa.firebaseapp.com",
  projectId: "alberto-e-liesa",
  storageBucket: "alberto-e-liesa.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Inicialização segura do Firebase (com verificação de credenciais ativas)
let db = null;
let isFirebaseReady = false;

try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("DummyKey")) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseReady = true;
    console.log("🔥 Firebase Firestore inicializado com sucesso!");
  } else {
    console.log("ℹ️ Firebase configurado em modo de transição (aguardando credenciais do console).");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

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
    console.error("Erro ao guardar RSVP no Firebase:", err);
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
  });
}
