// import { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { Button } from "./ui/button";
// import { NotificationBell } from "./NotificationBell";
// import { ProfileMenu } from "./ProfileMenu";

// import {
//   LayoutDashboard,
//   Target,
//   Menu,
//   X,
//   MessageCircle,
//   User,
//   type LucideIcon,
// } from "lucide-react";

// import { useNavigate, useLocation } from "react-router-dom";
// import type { JSX, ReactNode } from "react";

// /* ---------------- TYPES ---------------- */

// interface PageItem {
//   id: string;
//   label: string;
//   icon: LucideIcon;
//   path: string;
// }

// interface PageLayoutProps {
//   children: ReactNode;
// }

// /* ---------------- COMPONENT ---------------- */

// export function PageLayout({ children }: PageLayoutProps): JSX.Element {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const pages: PageItem[] = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard",
//     },
//     {
//       id: "skillmatch",
//       label: "SkillMatch",
//       icon: Target,
//       path: "/dashboard/skillmatch",
//     },
//     {
//       id: "helpdesk",
//       label: "Helpdesk",
//       icon: MessageCircle,
//       path: "/dashboard/helpdesk",
//     },
//   ];

//   const isActive = (path: string) =>
//     location.pathname === path ||
//     location.pathname.startsWith(path + "/");

//   return (
//     <div className="relative size-full">
//       {/* NAV */}
//       <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

//           <ProfileMenu
//             onSettings={() => navigate("/dashboard/settings")}
//             onLogout={() => (window.location.href = "/login")}
//           />

//           <div className="flex items-center gap-3">
//             <button onClick={() => navigate("/dashboard/profile")}>
//               <User className="size-7 text-gray-600" />
//             </button>

//             <NotificationBell />

//             <div
//               className="flex items-center gap-2 cursor-pointer"
//               onClick={() => navigate("/dashboard")}
//             >
//               <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold">S</span>
//               </div>
//               <span className="font-bold">StudentHub</span>
//             </div>
//           </div>

//           <div className="hidden md:flex gap-2">
//             {pages.map((p) => {
//               const Icon = p.icon;
//               return (
//                 <Button
//                   key={p.id}
//                   variant={isActive(p.path) ? "default" : "ghost"}
//                   onClick={() => navigate(p.path)}
//                 >
//                   <Icon className="size-4 mr-2" />
//                   {p.label}
//                 </Button>
//               );
//             })}
//           </div>

//           <button
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen((v) => !v)}
//           >
//             {mobileMenuOpen ? <X /> : <Menu />}
//           </button>
//         </div>

//         {/* MOBILE */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div className="md:hidden bg-white border-t">
//               {pages.map((p) => {
//                 const Icon = p.icon;
//                 return (
//                   <button
//                     key={p.id}
//                     className="w-full flex gap-3 px-6 py-3"
//                     onClick={() => {
//                       navigate(p.path);
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     <Icon />
//                     {p.label}
//                   </button>
//                 );
//               })}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       {/* CONTENT */}
//       <div className="pt-16">{children}</div>
//     </div>
//   );
// }
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { NotificationBell } from "./NotificationBell";
import { ProfileMenu } from "./ProfileMenu";

import {
  LayoutDashboard,
  Target,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import type { JSX, ReactNode } from "react";

/* ---------------- TYPES ---------------- */

interface PageLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

/* ---------------- COMPONENT ---------------- */

export function PageLayout({ children }: PageLayoutProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "skillmatch",
      label: "SkillMatch",
      icon: Target,
      path: "/dashboard/skillmatch",
    },
    {
      id: "helpdesk",
      label: "Helpdesk",
      icon: MessageCircle,
      path: "/dashboard/helpdesk",
    },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <div className="relative min-h-screen">
      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-lg text-gray-900">
              StudentHub
            </span>
          </div>

          {/* CENTER NAV (DESKTOP) */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={
                    isActive(item.path)
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }
                >
                  <Icon className="size-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            <NotificationBell />
<ProfileMenu
  onProfile={() => navigate("/dashboard/profile")}
  onSettings={() => navigate("/dashboard/settings")}
  onLogout={() => (window.location.href = "/login")}
/>


            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t bg-white"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50"
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* PAGE CONTENT */}
      <div className="pt-16">{children}</div>
    </div>
  );
}
