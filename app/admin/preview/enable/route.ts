import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  await requireAdmin();
  const draft = await draftMode();
  draft.enable();
  redirect("/");
}
