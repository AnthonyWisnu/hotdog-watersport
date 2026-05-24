import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function readEnv() {
  return Object.fromEntries(
    fs
      .readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.trim().startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [
          line.slice(0, index).trim(),
          line.slice(index + 1).trim().replace(/^["']|["']$/g, ""),
        ];
      })
  );
}

async function main() {
  const env = readEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase URL or service role key in .env.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const storagePath = "logos/default-logo.jpg";
  const localLogoPath = path.join("public", "logo", "logo.jpg");
  const file = fs.readFileSync(localLogoPath);

  const uploaded = await supabase.storage.from("site-media").upload(storagePath, file, {
    contentType: "image/jpeg",
    upsert: true,
  });

  if (uploaded.error) {
    throw uploaded.error;
  }

  const found = await supabase
    .from("media_assets")
    .select("id")
    .eq("path", storagePath)
    .maybeSingle();

  if (found.error) {
    throw found.error;
  }

  let assetId = found.data?.id;

  if (assetId) {
    const updated = await supabase
      .from("media_assets")
      .update({
        status: "published",
        alt_text: "Hot Dog Water Sport logo",
        caption: "Primary business logo",
      })
      .eq("id", assetId)
      .select("id")
      .single();

    if (updated.error) {
      throw updated.error;
    }

    assetId = updated.data.id;
  } else {
    const inserted = await supabase
      .from("media_assets")
      .insert({
        bucket: "site-media",
        path: storagePath,
        media_type: "image",
        mime_type: "image/jpeg",
        size_bytes: file.length,
        alt_text: "Hot Dog Water Sport logo",
        caption: "Primary business logo",
        status: "published",
      })
      .select("id")
      .single();

    if (inserted.error) {
      throw inserted.error;
    }

    assetId = inserted.data.id;
  }

  const settings = await supabase
    .from("site_settings")
    .select("logo_media_id,footer_logo_media_id")
    .eq("settings_key", "default")
    .maybeSingle();

  if (settings.error) {
    throw settings.error;
  }

  const patch = {};
  if (!settings.data?.logo_media_id) {
    patch.logo_media_id = assetId;
  }
  if (!settings.data?.footer_logo_media_id) {
    patch.footer_logo_media_id = assetId;
  }

  if (Object.keys(patch).length > 0) {
    const settingsUpdate = await supabase
      .from("site_settings")
      .update(patch)
      .eq("settings_key", "default");

    if (settingsUpdate.error) {
      throw settingsUpdate.error;
    }
  }

  console.log("Seeded logo media asset.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
