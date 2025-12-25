import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { usersRef, skillRequestsRef } from "../lib/firestore";
import { useAuth } from "../../hooks/useAuth";

/* ---------------- TYPES ---------------- */

interface Peer {
  id: string;
  name: string;
  avatar?: string;
  major?: string;
}

/* ---------------- COMPONENT ---------------- */

export function SuggestedPeers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [peers, setPeers] = useState<Peer[]>([]);

  /* ---------------- LOAD USERS ---------------- */

  useEffect(() => {
    if (!user) return;

    async function loadPeers() {
      const snap = await getDocs(usersRef);

      const data: Peer[] = snap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Peer),
        }))
        .filter((p) => p.id !== user.uid)
        .slice(0, 3); // top 3 only

      setPeers(data);
    }

    loadPeers();
  }, [user]);

  /* ---------------- CONNECT ---------------- */

  const handleConnect = async (peerId: string) => {
    if (!user) return;

    await addDoc(skillRequestsRef, {
      fromUserId: user.uid,
      toUserId: peerId,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    toast.success("Connection request sent");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-3">
      {peers.map((peer, index) => (
        <motion.div
          key={peer.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          className="
            flex items-center justify-between
            p-3 rounded-lg border border-gray-100
            hover:border-blue-200 hover:bg-blue-50/30
            transition-all
          "
        >
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border-2 border-white shadow-sm">
              <AvatarImage src={peer.avatar} alt={peer.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {peer.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium text-gray-900">{peer.name}</p>
              <p className="text-xs text-gray-500">{peer.major}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConnect(peer.id)}
            className="text-xs hover:bg-blue-600 hover:text-white hover:border-blue-600"
          >
            Connect
          </Button>
        </motion.div>
      ))}

      {/* View All */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/skillmatch")}
          className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Users className="size-4 mr-2" />
          View All Suggestions
        </Button>
      </motion.div>
    </div>
  );
}
