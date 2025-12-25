import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { UserPlus, MapPin, Star } from "lucide-react";
import type { JSX } from "react";

/* ---------------- TYPES ---------------- */

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Peer {
  id: string | number;
  name?: string;
  avatar?: string;
  initials?: string;
  major?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  skillLevel?: SkillLevel;
  rating?: number;
  projects?: number;
  matchScore?: number;
}

interface PeerCardProps {
  peer: Peer;
  delay?: number;
  onConnect: (peerId: Peer["id"]) => void;
}

/* ---------------- CONSTANTS ---------------- */

const skillLevelColors: Record<SkillLevel, string> = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-blue-100 text-blue-700 border-blue-200",
  Advanced: "bg-purple-100 text-purple-700 border-purple-200",
  Expert: "bg-orange-100 text-orange-700 border-orange-200",
};

/* ---------------- COMPONENT ---------------- */

export function PeerCard({
  peer,
  delay = 0,
  onConnect,
}: PeerCardProps): JSX.Element {
  const name = peer.name ?? "Student";
  const initials =
    peer.initials ??
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl border shadow-sm hover:shadow-xl transition"
    >
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-br from-blue-500 to-purple-600">
        {peer.matchScore !== undefined && (
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-purple-600">
            {peer.matchScore}% Match
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar className="size-24 border-4 border-white shadow-lg">
            <AvatarImage src={peer.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <div className="text-center mb-3">
          <h3 className="font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">
            {peer.major ?? "Student"}
          </p>
        </div>

        {/* Location + Stats */}
        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
          {peer.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {peer.location}
            </span>
          )}
          {peer.rating !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              {peer.rating}
            </span>
          )}
          {peer.projects !== undefined && (
            <span>{peer.projects} projects</span>
          )}
        </div>

        {/* Bio */}
        {peer.bio && (
          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
            {peer.bio}
          </p>
        )}

        {/* Skill Level */}
        {peer.skillLevel && (
          <div className="flex justify-center mb-4">
            <Badge
              variant="outline"
              className={skillLevelColors[peer.skillLevel]}
            >
              {peer.skillLevel}
            </Badge>
          </div>
        )}

        {/* Interests */}
        {peer.interests?.length ? (
          <div className="flex flex-wrap gap-1.5 justify-center mb-4">
            {peer.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Connect */}
        <Button
          onClick={() => onConnect(peer.id)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          <UserPlus className="size-4 mr-2" />
          Connect
        </Button>
      </div>
    </motion.div>
  );
}
