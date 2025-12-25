// import { Routes, Route } from "react-router-dom";
// import { Toaster } from "./components/ui/sonner";

// import { PageLayout } from "./components/PageLayout";
// import { DashboardCard } from "./components/DashboardCard";
// import { SuggestedPeers } from "./components/SuggestedPeers";
// import { ActiveHelpdesk } from "./components/ActiveHelpdesk";
// import { YourInterests } from "./components/YourInterests";

// import { HelpdeskRoutes } from "./components/HelpdeskRoutes";
// import { SkillMatchPage } from "./components/SkillMatchPage"; // ✅ FIX
// import { ProfilePage } from "./components/ProfilePage";
// import { SettingsPage } from "./components/SettingsPage";

// import { Users, MessageSquare, Target } from "lucide-react";
// import { motion } from "motion/react";

// import { useAuth } from "../hooks/useAuth";
// import { getDocs } from "firebase/firestore";
// import { useAuth } from "../hooks/useAuth";
// import { getDocs } from "firebase/firestore";
// import { usersRef, skillRequestsRef, questionsRef } from "./lib/firestore";
// import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";

// /* ================= DASHBOARD HOME ================= */

// function DashboardHome() {
//   const { user } = useAuth();
//   const userName = user?.displayName ?? "Guest";

//   const hour = new Date().getHours();
//   const greeting =
//     hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

//   const [stats, setStats] = useState({
//     peers: 0,
//     answered: 0,
//     sessions: 0,
//     streak: 0,
//   });

//   useEffect(() => {
//     async function loadStats() {
//       const [usersSnap, answersSnap, skillsSnap] = await Promise.all([
//         getDocs(usersRef),
//         getDocs(answersRef),
//         getDocs(skillRequestsRef),
//       ]);

//       setStats({
//         peers: usersSnap.size,
//         answered: answersSnap.size,
//         sessions: skillsSnap.size,
//         streak: 5,
//       });
//     }

//     loadStats();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-8">

//         {/* Welcome */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900">
//             {greeting}, {userName}
//           </h1>
//           <p className="text-gray-600">
//             Welcome to your activity hub.
//           </p>
//         </motion.div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: "Active Peers", value: stats.peers },
//             { label: "Answers", value: stats.answered },
//             { label: "Sessions", value: stats.sessions },
//             { label: "Streak", value: `${stats.streak} days` },
//           ].map((stat) => (
//             <div
//               key={stat.label}
//               className="bg-white border rounded-xl p-4"
//             >
//               <p className="text-sm text-gray-500">{stat.label}</p>
//               <p className="text-2xl font-bold">{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <DashboardCard title="Suggested Peers" icon={Users}>
//             <SuggestedPeers />
//           </DashboardCard>

//           <DashboardCard title="Active Helpdesk" icon={MessageSquare}>
//             <ActiveHelpdesk />
//           </DashboardCard>

//           <DashboardCard title="Your Interests" icon={Target}>
//             <YourInterests />
//           </DashboardCard>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= DASHBOARD APP ================= */

// export default function DashboardApp() {
//   return (
//     <>
//       <PageLayout>
//         <Routes>
//           <Route index element={<DashboardHome />} />
//           <Route path="skillmatch" element={<SkillMatchPage />} />
//           <Route path="helpdesk/*" element={<HelpdeskRoutes />} /> {/* ✅ FIX */}
//           <Route path="profile" element={<ProfilePage />} />
//           <Route path="settings" element={<SettingsPage />} />
//         </Routes>
//       </PageLayout>

//       <Toaster />
//     </>
//   );
// }
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";

import { PageLayout } from "./components/PageLayout";
import { DashboardCard } from "./components/DashboardCard";
import { SuggestedPeers } from "./components/SuggestedPeers";
import { ActiveHelpdesk } from "./components/ActiveHelpdesk";
import { YourInterests } from "./components/YourInterests";

import { HelpdeskRoutes } from "./components/HelpdeskRoutes";
import { SkillMatchPage } from "./components/SkillMatchPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";

import { Users, MessageSquare, Target } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { getDocs, collection } from "firebase/firestore";
import { usersRef, skillRequestsRef, questionsRef, db } from "./lib/firestore";

/* ================= DASHBOARD HOME ================= */

function DashboardHome() {
  const { user } = useAuth();
  const userName = user?.displayName ?? "Guest";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [stats, setStats] = useState({
    peers: 0,
    answered: 0,
    sessions: 0,
    streak: 5,
  });

  useEffect(() => {
    async function loadStats() {
      const [usersSnap, skillsSnap, questionsSnap] = await Promise.all([
        getDocs(usersRef),
        getDocs(skillRequestsRef),
        getDocs(questionsRef),
      ]);

      // ✅ Count answers from subcollections
      let totalAnswers = 0;
      for (const q of questionsSnap.docs) {
        const answersSnap = await getDocs(
          collection(db, "questions", q.id, "answers")
        );
        totalAnswers += answersSnap.size;
      }

      setStats({
        peers: usersSnap.size,
        answered: totalAnswers,
        sessions: skillsSnap.size,
        streak: 5,
      });
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            {greeting}, {userName}
          </h1>
          <p className="text-gray-600">Welcome to your activity hub.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Peers", value: stats.peers },
            { label: "Answers", value: stats.answered },
            { label: "Sessions", value: stats.sessions },
            { label: "Streak", value: `${stats.streak} days` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border rounded-xl p-4"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Suggested Peers" icon={Users}>
            <SuggestedPeers />
          </DashboardCard>

          <DashboardCard title="Active Helpdesk" icon={MessageSquare}>
            <ActiveHelpdesk />
          </DashboardCard>

          <DashboardCard title="Your Interests" icon={Target}>
            <YourInterests />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

/* ================= DASHBOARD APP ================= */

export default function DashboardApp() {
  return (
    <>
      <PageLayout>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="skillmatch" element={<SkillMatchPage />} />
          <Route path="helpdesk/*" element={<HelpdeskRoutes />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </PageLayout>

      <Toaster />
    </>
  );
}
