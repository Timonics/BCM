import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Login - BCM",
  description: "Sign in to your administrator account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
