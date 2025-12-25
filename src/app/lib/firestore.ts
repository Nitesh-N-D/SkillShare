// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   serverTimestamp,
// } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// /* COLLECTION REFERENCES */
// export const usersRef = collection(db, "users");
// export const questionsRef = collection(db, "questions");
// export const answersRef = collection(db, "answers");
// export const skillRequestsRef = collection(db, "skillRequests");
// export const notificationsRef = collection(db, "notifications");

// /* QUESTIONS */
// export async function createQuestion(data: {
//   title: string;
//   content: string;
//   tags: string[];
//   userId: string;
//   userName: string;
// }) {
//   await addDoc(questionsRef, {
//     ...data,
//     upvotes: 0,
//     views: 0,
//     createdAt: serverTimestamp(),
//   });
// }

// export async function getQuestions() {
//   const q = query(questionsRef, orderBy("createdAt", "desc"));
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({
//     id: d.id,
//     ...d.data(),
//   }));
// }

// /* ANSWERS */
// export async function createAnswer(data: {
//   questionId: string;
//   content: string;
//   userId: string;
//   userName: string;
// }) {
//   await addDoc(answersRef, {
//     ...data,
//     upvotes: 0,
//     createdAt: serverTimestamp(),
//   });
// }

// export async function getAnswers(questionId: string) {
//   const q = query(
//     answersRef,
//     where("questionId", "==", questionId),
//     orderBy("createdAt", "asc")
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({
//     id: d.id,
//     ...d.data(),
//   }));
// }
// /* NOTIFICATIONS */
// export async function createNotification(data: {
//   userId: string;
//   type: string;
//   content: string;
// }) {
//   await addDoc(notificationsRef, {
//     ...data,
//     createdAt: serverTimestamp(),
//   });
// }
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* ================= FIREBASE INIT ================= */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/* ================= COLLECTION REFERENCES ================= */

export const usersRef = collection(db, "users");
export const questionsRef = collection(db, "questions");
export const skillRequestsRef = collection(db, "skillRequests");
export const notificationsRef = collection(db, "notifications");

/* ================= QUESTIONS ================= */

export async function createQuestion(data: {
  title: string;
  content: string;
  tags: string[];
  userId: string;
  userName: string;
}) {
  await addDoc(questionsRef, {
    ...data,
    upvotes: 0,
    views: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getQuestions() {
  const q = query(questionsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/* ================= ANSWERS (FIXED) ================= */

export async function createAnswer(data: {
  questionId: string;
  content: string;
  userId: string;
  userName: string;
}) {
  const { questionId, content, userId, userName } = data;

  if (!questionId || !content || !userId) {
    throw new Error("Missing answer fields");
  }

  const answersRef = collection(db, "questions", questionId, "answers");

  await addDoc(answersRef, {
    content,
    userId,
    userName,
    upvotes: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getAnswers(questionId: string) {
  const answersRef = collection(db, "questions", questionId, "answers");

  const q = query(answersRef, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/* ================= NOTIFICATIONS ================= */

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  await addDoc(notificationsRef, {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}
