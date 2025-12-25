/* ================= FIREBASE IMPORTS ================= */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  onSnapshot,
} from "firebase/firestore";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ================= INIT ================= */

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/* ================= COLLECTION REFERENCES ================= */

export const usersRef = collection(db, "users");
export const questionsRef = collection(db, "questions");
export const answersRef = collection(db, "answers");
export const skillRequestsRef = collection(db, "skillRequests");
export const notificationsRef = collection(db, "notifications");

/* ======================================================
   QUESTIONS
====================================================== */

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
    acceptedAnswerId: null,
    createdAt: serverTimestamp(),
  });
}

export async function getQuestions() {
  const q = query(questionsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ======================================================
   ANSWERS
====================================================== */

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

  await addDoc(answersRef, {
    questionId,
    content,
    userId,
    userName,
    upvotes: 0,
    isAccepted: false,
    createdAt: serverTimestamp(),
  });
}

export async function getAnswers(questionId: string) {
  const q = query(
    answersRef,
    where("questionId", "==", questionId),
    orderBy("createdAt", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ================= REAL-TIME ANSWERS ================= */

export function subscribeToAnswers(
  questionId: string,
  callback: (answers: any[]) => void
) {
  const q = query(
    answersRef,
    where("questionId", "==", questionId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  });
}

/* ======================================================
   UPVOTES
====================================================== */

export async function upvoteAnswer(
  answerId: string,
  hasUpvoted: boolean
) {
  const ref = doc(db, "answers", answerId);

  await updateDoc(ref, {
    upvotes: increment(hasUpvoted ? -1 : 1),
  });
}

/* ======================================================
   ACCEPT ANSWER
====================================================== */

export async function acceptAnswer(
  questionId: string,
  answerId: string,
  answerUserId: string
) {
  await updateDoc(doc(db, "questions", questionId), {
    acceptedAnswerId: answerId,
  });

  await updateDoc(doc(db, "answers", answerId), {
    isAccepted: true,
  });

  await updateDoc(doc(db, "users", answerUserId), {
    reputation: increment(15),
  });
}

/* ======================================================
   NOTIFICATIONS
====================================================== */

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  await addDoc(notificationsRef, {
    ...data,
    isRead: false,
    createdAt: serverTimestamp(),
  });
}

export function subscribeNotifications(
  userId: string,
  callback: (count: number) => void
) {
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    where("isRead", "==", false)
  );

  return onSnapshot(q, (snap) => {
    callback(snap.size);
  });
}

/* ======================================================
   REPUTATION
====================================================== */

export async function addReputation(
  userId: string,
  points: number
) {
  await updateDoc(doc(db, "users", userId), {
    reputation: increment(points),
  });
}
