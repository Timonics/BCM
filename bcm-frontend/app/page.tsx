"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Church } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { churchInfo } from "@/data/church-info";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#009AF4] rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-4 md:px-8 lg:px-16 py-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden"
              >
                {churchInfo.logoUrl ? (
                  <img
                    src={churchInfo.logoUrl}
                    alt={`${churchInfo.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Church className="w-8 h-8 text-[#009AF4]" />
                )}
              </motion.div>
              <div className="hidden md:block">
                <h2 className="font-bold text-xl text-[#222B45]">
                  {churchInfo.name}
                </h2>
                <p className="text-sm text-[#8F9BB3]">{churchInfo.branch}</p>
              </div>
            </div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-[#009AF4] hover:bg-[#0086d6] text-white px-6 md:px-8 h-11 rounded-xl shadow-lg shadow-blue-200"
              >
                Admin Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="flex-1 px-4 md:px-8 lg:px-16 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Mobile logo and name */}
                <div className="md:hidden">
                  <h2 className="font-bold text-2xl text-[#222B45] mb-1">
                    {churchInfo.name}
                  </h2>
                  <p className="text-[#8F9BB3]">{churchInfo.branch}</p>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222B45] leading-tight">
                    Welcome to{" "}
                    <span className="text-[#009AF4] block mt-2">
                      BCM Manager
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-lg md:text-xl text-[#8F9BB3] leading-relaxed"
                >
                  "A comprehensive church administration system designed for
                  modern ministry management. Streamline your operations,
                  empower your leadership, and serve your community better."
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    onClick={() => router.push("")}
                    size="lg"
                    className="bg-[#009AF4] hover:bg-[#0086d6] text-white h-14 px-8 rounded-xl text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 rounded-xl text-lg border-2 border-[#EDF1F7] hover:border-[#009AF4] hover:bg-blue-50"
                  >
                    Learn More
                  </Button>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="pt-6 space-y-3"
                >
                  {churchInfo.address && (
                    <div className="flex items-center gap-3 text-[#8F9BB3]">
                      <MapPin className="w-5 h-5 text-[#009AF4]" />
                      <span>{churchInfo.address}</span>
                    </div>
                  )}
                  {churchInfo.email && (
                    <div className="flex items-center gap-3 text-[#8F9BB3]">
                      <Mail className="w-5 h-5 text-[#009AF4]" />
                      <span>{churchInfo.email}</span>
                    </div>
                  )}
                  {churchInfo.phone && (
                    <div className="flex items-center gap-3 text-[#8F9BB3]">
                      <Phone className="w-5 h-5 text-[#009AF4]" />
                      <span>{churchInfo.phone}</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                    src={churchInfo.imageUrl}
                    alt={`${churchInfo.name} - ${churchInfo.branch}`}
                    className="w-full h-100 md:h-125 lg:h-150 object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                  {/* Floating badge */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#009AF4] flex items-center justify-center shrink-0">
                        <Church className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#222B45] text-lg mb-1">
                          {churchInfo.name}
                        </h3>
                        <p className="text-[#8F9BB3] text-sm">
                          {churchInfo.branch}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative floating elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-2xl"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#009AF4] rounded-full opacity-20 blur-2xl"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="px-4 md:px-8 lg:px-16 py-6 border-t border-[#EDF1F7] bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8F9BB3]">
            <p>© 2026 {churchInfo.name}. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Powered by{" "}
              <span className="font-semibold text-[#009AF4]">BCM Manager</span>
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
