import { draftMode } from "next/headers";
import { getCurrentAdmin } from "./auth";

export async function isAdminPreviewEnabled() {
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return false;
  }

  const admin = await getCurrentAdmin();
  return Boolean(admin);
}
