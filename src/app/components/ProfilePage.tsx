// // import { useState } from "react";
// // import { motion } from "motion/react";
// // import { Card } from "./ui/card";
// // import { Badge } from "./ui/badge";
// // import { Avatar, AvatarFallback } from "./ui/avatar";
// // import { Skeleton } from "./ui/skeleton";
// // import type { JSX, ReactNode } from "react";

// // import {
// //   MessageCircle,
// //   HelpCircle,
// //   Heart,
// //   Calendar,
// //   Smile,
// //   Settings,
// // } from "lucide-react";
// // import { useAuth } from "../../hooks/useAuth";

// // /* ---------------- MAIN COMPONENT ---------------- */

// // export function ProfilePage(): JSX.Element {
// //   const { user, loading } = useAuth();

// //   /* Firebase-driven identity */
// //   const name = user?.displayName ?? "Guest User";
// //   const bio = user?.email ?? "No bio available";

// //   const [avatarImage, setAvatarImage] = useState<string | null>(null);
// //   const [coverImage, setCoverImage] = useState<string | null>(null);

// //   const stats = {
// //     questionsAsked: 12,
// //     answersGiven: 8,
// //     helpfulVotes: 24,
// //     daysActive: 45,
// //   };

// //   const handleImageUpload = (
// //     e: React.ChangeEvent<HTMLInputElement>,
// //     type: "avatar" | "cover"
// //   ): void => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     const reader = new FileReader();
// //     reader.onload = () => {
// //       if (type === "avatar") setAvatarImage(reader.result as string);
// //       if (type === "cover") setCoverImage(reader.result as string);
// //     };
// //     reader.readAsDataURL(file);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen p-12">
// //         <Skeleton className="h-64 w-full rounded-3xl" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 md:p-12">
// //       <div className="max-w-5xl mx-auto space-y-6">

// //         {/* HEADER */}
// //         <Card className="overflow-hidden shadow-xl">
// //           <div
// //             className="h-32 relative"
// //             style={{
// //               background: coverImage
// //                 ? `url(${coverImage}) center / cover no-repeat`
// //                 : "linear-gradient(to right, #a855f7, #ec4899, #fb923c)",
// //             }}
// //           >
// //             <label className="absolute top-3 right-3 bg-white px-3 py-1 rounded-lg text-xs cursor-pointer">
// //               Change cover
// //               <input
// //                 type="file"
// //                 hidden
// //                 accept="image/*"
// //                 onChange={(e) => handleImageUpload(e, "cover")}
// //               />
// //             </label>
// //           </div>

// //           <div className="p-8 -mt-16">
// //             <div className="flex gap-6 items-end">
// //               <div className="relative">
// //                 <Avatar className="size-32 border-4 border-white shadow-xl">
// //                   {avatarImage ? (
// //                     <img src={avatarImage} className="rounded-full" />
// //                   ) : (
// //                     <AvatarFallback className="text-3xl font-bold">
// //                       {name
// //                         .split(" ")
// //                         .map((w) => w[0])
// //                         .join("")
// //                         .toUpperCase()}
// //                     </AvatarFallback>
// //                   )}
// //                 </Avatar>

// //                 <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer">
// //                   <input
// //                     type="file"
// //                     hidden
// //                     accept="image/*"
// //                     onChange={(e) => handleImageUpload(e, "avatar")}
// //                   />
// //                   <Settings className="w-4 h-4" />
// //                 </label>
// //               </div>

// //               <div className="space-y-2">
// //                 <h1 className="text-2xl font-bold">{name}</h1>
// //                 <p className="text-gray-600">{bio}</p>
// //                 <Badge>🎯 Authenticated User</Badge>
// //               </div>
// //             </div>
// //           </div>
// //         </Card>

// //         {/* STATS */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <StatCard icon={<HelpCircle />} label="Questions" value={stats.questionsAsked} />
// //           <StatCard icon={<MessageCircle />} label="Answers" value={stats.answersGiven} />
// //           <StatCard icon={<Heart />} label="Helpful" value={stats.helpfulVotes} />
// //           <StatCard icon={<Calendar />} label="Days Active" value={stats.daysActive} />
// //         </div>

// //         {/* FOOTER */}
// //         <div className="text-center text-gray-600 pt-6 flex items-center justify-center gap-2">
// //           <Smile className="text-purple-500" />
// //           Keep learning and growing. Your journey matters 💜
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ---------------- SUB COMPONENT ---------------- */

// // function StatCard({
// //   icon,
// //   label,
// //   value,
// // }: {
// //   icon: ReactNode;
// //   label: string;
// //   value: number;
// // }): JSX.Element {
// //   return (
// //     <motion.div whileHover={{ scale: 1.05 }}>
// //       <Card className="p-6 text-center shadow-lg">
// //         <div className="mb-2">{icon}</div>
// //         <div className="text-2xl font-bold">{value}</div>
// //         <div className="text-sm text-gray-600">{label}</div>
// //       </Card>
// //     </motion.div>
// //   );
// // }
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { useAuth } from "../../hooks/useAuth";
// import { motion } from "motion/react";

// export function ProfilePage() {
//   const { user } = useAuth();

//   if (!user) return null;

//   const initials =
//     user.displayName
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase() ?? "U";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto p-8">

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl border p-8"
//         >
//           {/* HEADER */}
//           <div className="flex items-center gap-6 mb-6">
//             <Avatar className="size-24">
//               <AvatarImage src={user.photoURL ?? ""} />
//               <AvatarFallback className="text-2xl">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>

//             <div>
//               <h2 className="text-2xl font-bold">
//                 {user.displayName ?? "Student"}
//               </h2>
//               <p className="text-gray-600">{user.email}</p>
//             </div>
//           </div>

//           {/* BIO */}
//           <div className="mb-6">
//             <h3 className="font-semibold mb-2">About</h3>
//             <p className="text-gray-700">
//               Passionate learner interested in collaboration, projects,
//               and peer learning.
//             </p>
//           </div>

//           {/* INTERESTS */}
//           <div className="mb-6">
//             <h3 className="font-semibold mb-2">Interests</h3>
//             <div className="flex flex-wrap gap-2">
//               {["Web Dev", "DSA", "React", "Firebase"].map((i) => (
//                 <Badge key={i} variant="secondary">
//                   {i}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex gap-3">
//             <Button>Edit Profile</Button>
//             <Button variant="outline">Change Password</Button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import type { JSX, ReactNode } from "react";

import {
  MessageCircle,
  HelpCircle,
  Heart,
  Calendar,
  Smile,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/* ================= PROFILE PAGE ================= */

export function ProfilePage(): JSX.Element {
  const { user, loading } = useAuth();

  const name = user?.displayName ?? "Guest User";
  const bio = user?.email ?? "No bio available";

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const stats = {
    questionsAsked: 12,
    answersGiven: 8,
    helpfulVotes: 24,
    daysActive: 45,
  };

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "avatar") setAvatarImage(reader.result as string);
      if (type === "cover") setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen p-12">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <Card className="overflow-hidden shadow-xl">
          <div
            className="h-36 relative"
            style={{
              background: coverImage
                ? `url(${coverImage}) center / cover no-repeat`
                : "linear-gradient(to right, #8b5cf6, #ec4899, #fb923c)",
            }}
          >
            <label className="absolute top-3 right-3 bg-white px-3 py-1 rounded-lg text-xs cursor-pointer shadow">
              Change cover
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "cover")}
              />
            </label>
          </div>

          <div className="p-8 -mt-16">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">

              {/* AVATAR */}
              <div className="relative">
                <Avatar className="size-32 border-4 border-white shadow-xl">
                  {avatarImage ? (
                    <img src={avatarImage} className="rounded-full" />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold">
                      {name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "avatar")}
                  />
                  <Settings className="w-4 h-4 text-gray-700" />
                </label>
              </div>

              {/* INFO */}
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {name}
                </h1>
                <p className="text-gray-600">{bio}</p>
                <Badge className="bg-purple-100 text-purple-700">
                  🎯 Authenticated User
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<HelpCircle />} label="Questions" value={stats.questionsAsked} />
          <StatCard icon={<MessageCircle />} label="Answers" value={stats.answersGiven} />
          <StatCard icon={<Heart />} label="Helpful Votes" value={stats.helpfulVotes} />
          <StatCard icon={<Calendar />} label="Days Active" value={stats.daysActive} />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 text-gray-600 pt-6">
          <Smile className="text-purple-500" />
          Keep learning and growing. Your journey matters 💜
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}): JSX.Element {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card className="p-6 text-center shadow-lg">
        <div className="flex justify-center mb-2 text-purple-600">
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {value}
        </div>
        <div className="text-sm text-gray-600">
          {label}
        </div>
      </Card>
    </motion.div>
  );
}
