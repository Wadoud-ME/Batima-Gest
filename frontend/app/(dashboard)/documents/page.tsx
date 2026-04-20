import { cookies } from "next/headers";
import { DocumentsClient } from "./DocumentsClient";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const cookieStore = await cookies();
  const mockRole = cookieStore.get("mockRole")?.value || "Resident";
  const isAdmin = mockRole === "Admin";

  return <DocumentsClient isAdmin={isAdmin} />;
}
