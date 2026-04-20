// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { Database } from '@/types/database.types'
import { cookies } from "next/headers";
import { AnnouncementsClient } from "./AnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";
  const isAdmin = mockRole === "Admin";

  return <AnnouncementsClient isAdmin={isAdmin} />;
}
