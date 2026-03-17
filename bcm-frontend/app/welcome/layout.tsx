import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Welcome - BCM",
  description: "Welcome back to BCM ",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
