"use client";
import ClassManagementOverview from "./page";
import { useRouter } from "next/navigation";

export default function Classes() {
  const router = useRouter();
  return (
    <ClassManagementOverview
      onNavigateToBaptismalDetail={() => router.push("")}
      onNavigateToETSDetail={() => router.push("")}
      onNavigateToPreYouthDetail={() => router.push("")}
    />
  );
}
