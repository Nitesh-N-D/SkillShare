import { JSX, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ReplySection } from "./ReplySection";
import { ArrowUp, Eye, Clock, Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";

import { createAnswer, getAnswers } from "../lib/firestore";
import { createNotification } from "../lib/notifications";
import { useAuth } from "../../hooks/useAuth";

import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firestore";

/* ---------------- TYPES ---------------- */

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  views: number;
  userId: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
    reputation: number;
  };
}

interface Reply {
  id: string;
  content: string;
  upvotes: number;
  author: {
    name: string;
    initials: string;
    reputation?: number;
  };
}

interface Props {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
}

/* ---------------- COMPONENT ---------------- */

export function QuestionDetailModal({
  question,
  isOpen,
  onClose,
}: Props): JSX.Element | null {
  const { user } = useAuth();

  const [replies, setReplies] = useState<Reply[]>([]);
  const [upvotes, setUpvotes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  /* -------- GUARD -------- */
  if (!isOpen || !question) return null;

  /* -------- INCREMENT VIEWS (ON OPEN) -------- */
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const ref = doc(db, "questions", question.id);
        await updateDoc(ref, { views: increment(1) });
      } catch (err) {
        console.error("View increment failed", err);
      }
    };

    incrementViews();
    setUpvotes(question.upvotes ?? 0);
  }, [question.id]);

  /* -------- LOAD REPLIES -------- */
  useEffect(() => {
    async function loadReplies() {
      try {
        const answers = await getAnswers(question.id);

        setReplies(
          answers.map((a: any) => ({
            id: a.id,
            content: a.content,
            upvotes: a.upvotes ?? 0,
            author: {
              name: a.userName ?? "Guest",
              initials:
                a.userName?.slice(0, 2).toUpperCase() ?? "GU",
              reputation: 0,
            },
          }))
        );
      } catch (err) {
        console.error("Failed to load replies", err);
      }
    }

    loadReplies();
  }, [question.id]);

  /* -------- POST REPLY -------- */
  const handleReplySubmit = async (content: string) => {
    if (!user) {
      toast.error("Please login to post an answer");
      return;
    }

    try {
      await createAnswer({
        questionId: question.id,
        content,
        userId: user.uid,
        userName: user.displayName || "Student",
      });

      if (question.userId !== user.uid) {
        await createNotification({
          userId: question.userId,
          type: "answer",
          title: "New Answer",
          message: "Someone replied to your question",
          link: `/dashboard/helpdesk/${question.id}`,
        });
      }

      const updated = await getAnswers(question.id);

      setReplies(
        updated.map((a: any) => ({
          id: a.id,
          content: a.content,
          upvotes: a.upvotes ?? 0,
          author: {
            name: a.userName ?? "Guest",
            initials:
              a.userName?.slice(0, 2).toUpperCase() ?? "GU",
            reputation: 0,
          },
        }))
      );

      toast.success("Reply posted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post reply");
    }
  };

  /* -------- RENDER -------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <DialogHeader>
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{question.title}</h2>

                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex gap-1 items-center">
                    <Clock className="size-4" /> just now
                  </span>
                  <span className="flex gap-1 items-center">
                    <Eye className="size-4" /> {question.views + 1}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setIsBookmarked(!isBookmarked)}>
                  <Bookmark
                    className={isBookmarked ? "fill-yellow-500" : ""}
                  />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied");
                  }}
                >
                  <Share2 />
                </button>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center">
              <ArrowUp />
              <span className="font-bold">{upvotes}</span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={question.author.avatar} />
                  <AvatarFallback>
                    {question.author.initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">
                    {question.author.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {question.author.reputation} reputation
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap">
                {question.content}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                {question.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <ReplySection
            replies={replies}
            onReplySubmit={handleReplySubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
