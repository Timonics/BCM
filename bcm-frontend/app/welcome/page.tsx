"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Church,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Music,
  GraduationCap,
  Crown,
} from "lucide-react";
import { churchInfo } from "@/data/church-info";
import { useRouter } from "next/dist/client/components/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome - BCM",
  description: "Welcome back to BCM ",
};

export default function WelcomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const adminName =
    typeof window !== "undefined" ? localStorage.getItem("adminName") : null;

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowFeatures(true), 1500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const features = [
    {
      icon: Users,
      label: "Member Management",
      color: "from-blue-400 to-blue-600",
      delay: 0,
      page: "Members",
    },
    {
      icon: Music,
      label: "Band & Units",
      color: "from-purple-400 to-purple-600",
      delay: 0.1,
      page: "Bands",
    },
    {
      icon: GraduationCap,
      label: "Class System",
      color: "from-green-400 to-green-600",
      delay: 0.2,
      page: "Classes",
    },
    {
      icon: Crown,
      label: "Leadership",
      color: "from-orange-400 to-orange-600",
      delay: 0.3,
      page: "Leadership",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#009AF4] via-blue-500 to-blue-700 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring",
            }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-3xl bg-white shadow-2xl flex items-center justify-center overflow-hidden relative">
              {churchInfo.logoUrl ? (
                <img
                  src={churchInfo.logoUrl}
                  alt={`${churchInfo.name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Church className="w-16 h-16 text-[#009AF4]" />
              )}
              {/* Sparkle effect */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-white rounded-3xl"
              />
            </div>
          </motion.div>

          {/* Success Check */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </motion.div>

          {/* Welcome Text */}
          {showContent && (
            <>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                  Welcome Back!
                </h1>
                <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl text-blue-100">
                  <Sparkles className="w-6 h-6" />
                  <span>{adminName ?? "Admin"}</span>
                  <Sparkles className="w-6 h-6" />
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
              >
                You've successfully logged in to {churchInfo.name} -{" "}
                {churchInfo.branch}
              </motion.p>

              {/* Church Info Card */}
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-10 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 max-w-md mx-auto"
              >
                <div className="text-white/80 text-sm mb-2">
                  You're managing
                </div>
                <div className="text-white font-bold text-xl">
                  {churchInfo.name}
                </div>
                <div className="text-blue-100">{churchInfo.branch}</div>
              </motion.div>
            </>
          )}

          {/* Features Grid */}
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ y: 50, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 1 + feature.delay,
                        type: "spring",
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        router.push(`/dashboard/${feature.page.toLowerCase()}`)
                      }
                      className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">
                        {feature.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Enter Dashboard Button */}
          {showFeatures && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                className="h-16 px-12 bg-white text-[#009AF4] hover:bg-blue-50 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all group"
              >
                Enter Dashboard
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Button>

              <p className="mt-4 text-white/70 text-sm">
                Press to access your admin panel
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Animated Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <motion.path
            animate={{
              d: [
                "M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,213.3C672,213,768,171,864,149.3C960,128,1056,128,1152,138.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
      </div>
    </div>
  );
}
