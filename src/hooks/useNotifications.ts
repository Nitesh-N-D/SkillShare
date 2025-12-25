import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../app/lib/firestore";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, snap => {
      setNotifications(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAllRead = async () => {
    await Promise.all(
      notifications
        .filter(n => !n.read)
        .map(n =>
          updateDoc(doc(db, "notifications", n.id), { read: true })
        )
    );
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAllRead,
    loading,
  };
}
