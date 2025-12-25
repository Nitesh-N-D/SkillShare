import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firestore";

export async function createUserProfile(user: any) {
  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName || "Student",
    avatar: user.photoURL || "",
    major: "Computer Science",
    location: "Campus",
    bio: "Interested in collaborative learning",
    interests: ["Web", "DSA"],
    skillLevel: "Intermediate",
    rating: 4.5,
    projects: 3,
    createdAt: serverTimestamp(),
  });
}
