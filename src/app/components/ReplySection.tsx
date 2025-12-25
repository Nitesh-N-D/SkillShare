import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { MessageCircle, Clock, Check, ArrowUp } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import type { JSX } from "react";

/* ---------------- TYPES ---------------- */

export interface Reply {
  id: string;
  content: string;
  upvotes: number;
  isAccepted?: boolean;
  createdAt?: any; // Firestore Timestamp
  author: {
    name: string;
    avatar?: string;
    initials: string;
    reputation?: number;
  };
}

interface ReplySectionProps {
  replies?: Reply[];
  onReplySubmit: (content: string) => Promise<void>;
}

/* ---------------- UTILS ---------------- */

function timeAgo(timestamp?: any): string {
  if (!timestamp?.seconds) return "just now";

  const diff = Date.now() - timestamp.seconds * 1000;
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

/* ---------------- COMPONENT ---------------- */

export function ReplySection({
  replies = [],
  onReplySubmit,
}: ReplySectionProps): JSX.Element {
  const { user } = useAuth();

  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to post an answer");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      await onReplySubmit(replyContent.trim());
      setReplyContent("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="size-5 text-gray-600" />
        <h3 className="font-semibold">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h3>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.04 }}
            className={`rounded-xl border p-5 bg-white ${
              reply.isAccepted ? "border-green-400 bg-green-50/40" : ""
            }`}
          >
            <div className="flex gap-4">
              {/* Upvotes (display only) */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <ArrowUp className="size-4 text-gray-400" />
                </div>
                <span className="text-sm font-bold">{reply.upvotes}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={reply.author.avatar} />
                      <AvatarFallback>
                        {reply.author.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{reply.author.name}</p>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="size-3" />
                        {timeAgo(reply.createdAt)}
                      </span>
                    </div>
                  </div>

                  {reply.isAccepted && (
                    <Badge className="bg-green-600 text-white">
                      <Check className="size-3 mr-1" />
                      Accepted
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Reply */}
      <div className="rounded-xl border bg-blue-50 p-5">
        <h4 className="font-semibold mb-2">Your Answer</h4>

        {!user ? (
          <p className="text-sm text-gray-600">
            Please login to post an answer.
          </p>
        ) : (
          <>
            <Textarea
              rows={4}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a helpful reply…"
            />

            <div className="flex justify-end mt-3">
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Posting…" : "Post Reply"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
