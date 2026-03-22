"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import {
  Church,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader,
  CheckCircle,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { churchInfo } from "@/data/church-info";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!email || !password || !role) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      // Call login mutation
      login({ email, password });
      
      // setCodeSent(true);
      // setShowVerification(true);
      // toast.success("Verification code sent to your email!");
      
    } catch (err: any) {
      // Error is already handled by the hook's onError
      // But we can set local error state if needed
      setError(err.message || "Login failed. Please try again.");
    }
  };

  // const handleVerifyCode = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (verificationCode.length !== 6) {
  //     setError("Please enter a valid 6-digit code");
  //     toast.error("Please enter a valid 6-digit code");
  //     return;
  //   }

  //   try {
  //     // Here you would call your verification API
  //     // For now, simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
      
  //     if (verificationCode === "123456") {
  //       toast.success("Verification successful! Redirecting...");
  //       router.push("/welcome");
  //     } else {
  //       throw new Error("Invalid verification code");
  //     }
  //   } catch (err: any) {
  //     setError(err.message || "Invalid verification code. Please try again.");
  //     toast.error(err.message || "Invalid verification code. Please try again.");
  //   }
  // };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setVerificationCode("");
    setCodeSent(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-20 md:-top-40 md:-right-40 w-60 h-60 md:w-80 md:h-80 bg-blue-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-60 h-60 md:w-80 md:h-80 bg-[#009AF4] rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="text-[#8F9BB3] hover:text-[#222B45] -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-[#EDF1F7]"
          >
            {/* Logo and Header */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-linear-to-br from-[#009AF4] to-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center overflow-hidden"
              >
                {churchInfo.logoUrl ? (
                  <img
                    src={churchInfo.logoUrl}
                    alt={`${churchInfo.name} Logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Church className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222B45] mb-2"
              >
                {showVerification ? "Verify Your Identity" : "Admin Login"}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-sm sm:text-base text-[#8F9BB3]"
              >
                {showVerification
                  ? "Enter the verification code sent to your email"
                  : `${churchInfo.name} - ${churchInfo.branch}`}
              </motion.p>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            {!showVerification ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                onSubmit={handleLogin}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <Label
                    htmlFor="email"
                    className="text-[#222B45] font-medium text-sm"
                  >
                    Email Address
                  </Label>
                  <div className="mt-2 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F9BB3]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="h-11 sm:h-12 pl-11 rounded-xl border-[#EDF1F7] focus:border-[#009AF4] focus:ring-[#009AF4] text-sm sm:text-base"
                      required
                      disabled={isLoggingIn}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-[#222B45] font-medium text-sm"
                  >
                    Password
                  </Label>
                  <div className="mt-2 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F9BB3]" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 sm:h-12 pl-11 rounded-xl border-[#EDF1F7] focus:border-[#009AF4] focus:ring-[#009AF4] text-sm sm:text-base"
                      required
                      disabled={isLoggingIn}
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="role"
                    className="text-[#222B45] font-medium text-sm"
                  >
                    Role
                  </Label>
                  <div className="mt-2 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8F9BB3] z-10 pointer-events-none" />
                    <Select 
                      value={role} 
                      onValueChange={setRole} 
                      required
                      disabled={isLoggingIn}
                    >
                      <SelectTrigger className="h-11 sm:h-12 pl-11 rounded-xl w-full border-[#EDF1F7] focus:border-[#009AF4] focus:ring-[#009AF4] text-sm sm:text-base">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-admin">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            <span>Super Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="leadership">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span>Leadership</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-600"></span>
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-11 sm:h-12 bg-[#009AF4] hover:bg-[#0086d6] text-white rounded-xl text-sm sm:text-base font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              /* Verification Form */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {codeSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium text-xs sm:text-sm">
                        Code Sent!
                      </p>
                      <p className="text-green-700 text-xs sm:text-sm mt-0.5">
                        A 6-digit verification code has been sent to {email}
                      </p>
                    </div>
                  </motion.div>
                )}

                <form
                  // onSubmit={handleVerifyCode}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <Label
                      htmlFor="code"
                      className="text-[#222B45] font-medium text-sm"
                    >
                      Verification Code
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit code"
                        className="h-12 sm:h-14 rounded-xl border-[#EDF1F7] focus:border-[#009AF4] focus:ring-[#009AF4] text-center text-lg sm:text-xl tracking-widest font-mono"
                        maxLength={6}
                        required
                        disabled={isLoggingIn}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoggingIn || verificationCode.length !== 6}
                    className="w-full h-11 sm:h-12 bg-[#009AF4] hover:bg-[#0086d6] text-white rounded-xl text-sm sm:text-base font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackToLogin}
                    disabled={isLoggingIn}
                    className="w-full text-[#8F9BB3] hover:text-[#222B45] text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Footer Note */}
            {!showVerification && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#EDF1F7] text-center text-xs sm:text-sm text-[#8F9BB3]"
              >
                <p>Secure admin access with two-factor authentication</p>
              </motion.div>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[#8F9BB3]"
          >
            Need help? Contact your system administrator
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}