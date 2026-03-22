import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Members - BCM",
  description: "View and manage members on BCM",
};

export default function Membersayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
