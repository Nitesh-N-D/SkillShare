import { JSX, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PeerCard, Peer } from "./PeerCard";
import { EmptyState } from "./EmptyState";
import { Badge } from "./ui/badge";
import { Target, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { usersRef, skillRequestsRef } from "../lib/firestore";
import { createNotification } from "../lib/notifications";
import { useAuth } from "../../hooks/useAuth";

/* ================= COMPONENT ================= */

export function SkillMatchPage(): JSX.Element {
  const { user } = useAuth();
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD PEERS ---------------- */

  useEffect(() => {
    if (!user) return;

    async function loadPeers() {
      try {
        setLoading(true);

        const snap = await getDocs(usersRef);

        const normalizedPeers: Peer[] = snap.docs
          .filter((doc) => doc.id !== user.uid)
          .map((doc) => {
            const d = doc.data();

            return {
              id: doc.id,
              name: d.name ?? "Student",
              avatar: d.avatar ?? "",
              initials:
                d.initials ??
                (d.name
                  ? d.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n: string) => n[0])
                      .join("")
                  : "ST"),
              major: d.major ?? "Computer Science",
              location: d.location ?? "Campus",
              bio: d.bio ?? "Interested in collaborative learning.",
              interests: d.interests ?? ["Web", "DSA"],
              skillLevel: d.skillLevel ?? "Intermediate",
              rating: d.rating ?? 4.5,
              projects: d.projects ?? 3,
              matchScore: Math.floor(Math.random() * 20) + 80, // 80–99%
            };
          });

        setPeers(normalizedPeers);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load peers");
      } finally {
        setLoading(false);
      }
    }

    loadPeers();
  }, [user]);

  /* ---------------- CONNECT ---------------- */

  const handleConnect = async (peerId: Peer["id"]) => {
    if (!user) return;

    await addDoc(skillRequestsRef, {
      fromUserId: user.uid,
      toUserId: peerId,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    await createNotification({
      userId: String(peerId),
      type: "connection",
      title: "New SkillMatch request",
      message: "Someone wants to connect with you",
      link: "/dashboard/skillmatch",
    });

    toast.success("Connection request sent");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="size-8 text-blue-600" />
            <h1 className="text-3xl font-bold">SkillMatch</h1>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Sparkles className="size-3 mr-1" />
              Smart Matching
            </Badge>
          </div>
          <p className="text-gray-600">
            Discover peers who match your learning goals.
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <p className="text-sm text-gray-500">Loading peers…</p>
          ) : peers.length > 0 ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {peers.map((peer, i) => (
                <PeerCard
                  key={peer.id}
                  peer={peer}
                  delay={i * 0.05}
                  onConnect={handleConnect}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
