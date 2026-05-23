# Admin CMS Implementation Plan

This plan breaks the admin CMS work into small, verifiable phases. Do not implement all phases at once. Finish and verify each phase before moving to the next one.

## Goal

Build a secure admin area so the site owner can update marketing content without editing code.

The admin should eventually manage:

- Hero content: title, subtitle, CTA text, background image/video
- Services: name, tagline, description, category labels, price, duration, rating, badges, images, video, WhatsApp message
- Gallery: photos/videos, categories, captions, alt text, featured status
- FAQ: questions, answers, category, order, publish status
- Testimonials: guest name, rating, review text, image, related service
- Business profile: about text, values, safety commitment
- Contact and location: WhatsApp, email, address, hours, Google Maps embed, social links
- SEO basics: meta title, meta description, OG image, image alt text

## Recommended Stack

- Supabase Auth for admin login
- Supabase Postgres for content data
- Supabase Storage for images and videos
- Next.js App Router for admin pages and server-side content loading
- Row Level Security on every exposed Supabase table

## Phase 0 - Baseline Cleanup

Status: Done.

Purpose: make the current project stable before adding admin complexity.

Tasks:

- Fix existing lint errors.
- Replace internal `<a href="/">` navigation with `next/link`.
- Fix React hook lint errors in `Header` and `CountUp`.
- Add `data-scroll-behavior="smooth"` to the root `<html>` element or remove global smooth scroll.
- Clean mojibake characters such as broken em dash, copyright, and ellipsis sequences in README, CSS comments, and visible UI strings.
- Run `npm run lint`.
- Run `npm run build`.

Done when:

- Lint passes.
- Production build passes.
- No intentional behavior changes beyond cleanup.

## Phase 1 - Supabase Project Setup

Status: Partially done. Local package setup, environment placeholders, and Supabase helpers are in place. Creating/connecting the actual Supabase project and verifying a live connection still require real Supabase credentials in `.env.local`.

Purpose: prepare the backend foundation without changing site behavior yet.

Tasks:

- Create or connect a Supabase project.
- Add required environment variables to `.env.example`.
- Add real values to local `.env.local`.
- Install Supabase client packages.
- Create Supabase browser/server client helpers.
- Confirm the app can connect to Supabase.

Expected environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` only for server-only scripts if truly needed
- `NEXT_PUBLIC_SITE_URL`

Security notes:

- Never expose service role keys in client code.
- Keep admin authorization data in app metadata or a dedicated profile/admin table, not user-editable metadata.

Done when:

- Supabase connection works locally.
- No public page depends on database content yet.
- Existing site still renders from static data.

## Phase 2 - Admin Authentication

Status: Done. `/admin/login` and protected `/admin` routes are implemented with Supabase Auth and `admin_users` authorization. A first admin user still must be created in Supabase Auth and inserted into `public.admin_users`.

Purpose: create a protected admin entry point.

Tasks:

- Add `/admin/login`.
- Add `/admin` protected layout.
- Implement login/logout.
- Protect admin routes with server-side session checks.
- Create an admin authorization rule.
- Add a simple admin dashboard shell.

Admin authorization options:

- Preferred: `admin_users` table keyed by Supabase auth user ID.
- Alternative: app metadata role such as `role: "admin"`.

Done when:

- Unauthenticated users are redirected to `/admin/login`.
- Non-admin authenticated users cannot access `/admin`.
- Admin users can login, view dashboard, and logout.

## Phase 3 - Database Schema

Status: Done. The CMS schema has been applied to Supabase with RLS enabled on all public tables and verified through MCP.

Purpose: define the content model before wiring UI forms.

Tables to create:

- `site_settings`
- `services`
- `service_media`
- `gallery_items`
- `faqs`
- `testimonials`
- `business_profile`
- `media_assets`

Common fields:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `status` such as `draft`, `published`, `archived`
- `sort_order`

Content-specific fields:

- `services`: title, slug, headline, description, category labels, price, duration, rating, badge, equipment list, rental info, operational notes, WhatsApp message
- `service_media`: service ID, media asset ID, media type, alt text, caption, sort order
- `gallery_items`: media asset ID, category, alt text, caption, featured, status, sort order
- `faqs`: question, answer, category, status, sort order
- `testimonials`: guest name, guest origin, rating, review, image asset, related service, featured, status
- `site_settings`: hero title, hero subtitle, CTA text, hero media, contact fields, maps embed, social links, SEO defaults
- `business_profile`: about text, brand story, values, safety commitment

Security requirements:

- Enable RLS on every table.
- Public users can only read published content.
- Admin users can create, update, delete, and read draft content.
- Storage policies must allow public read for published assets and admin-only writes.

Done when:

- Schema exists.
- RLS policies are verified.
- Test queries prove public and admin access behave correctly.

## Phase 4 - Media Storage

Status: Done. Private `site-media` bucket is configured with MIME/size limits, storage RLS policies, and client helpers for validation, upload, delete, and signed URLs.

Purpose: make upload reusable before building content forms.

Tasks:

- Create Supabase Storage bucket for media.
- Decide bucket structure:
  - `services/{service-id}/...`
  - `gallery/...`
  - `hero/...`
  - `testimonials/...`
- Build upload helper.
- Build delete helper.
- Build media asset database insert after upload.
- Support image and video MIME validation.
- Add file size limits.
- Add alt text and caption metadata.

Recommended constraints:

- Images: JPG, PNG, WebP
- Videos: MP4, WebM
- Keep hero video size conservative for performance.

Done when:

- Admin can upload a test image.
- Uploaded file is stored in Supabase Storage.
- `media_assets` record is created.
- Public URL or signed URL strategy is confirmed.

## Phase 5 - Admin UI Foundation

Status: Done. Protected admin shell, responsive navigation, placeholder module pages, reusable cards, page headers, state blocks, form actions, and confirm button components are in place.

Purpose: create reusable admin patterns before individual modules.

Tasks:

- Add admin layout with sidebar navigation.
- Add pages:
  - `/admin`
  - `/admin/hero`
  - `/admin/services`
  - `/admin/gallery`
  - `/admin/faqs`
  - `/admin/testimonials`
  - `/admin/business`
  - `/admin/settings`
- Add shared form controls.
- Add save/cancel states.
- Add loading, empty, error, and success states.
- Add confirm dialog for destructive actions.

Done when:

- Admin navigation works.
- UI shell is responsive.
- No content modules are fully wired yet except placeholders.

## Phase 6 - Services CMS

Status: Done. Admin can create, edit, delete, publish/archive services, manage price/duration/rating/badges/categories/equipment/WhatsApp copy, and attach multiple uploaded media assets. Public homepage/services page read published Supabase services with local static fallback. Initial services have been seeded into Supabase.

Purpose: migrate the most important editable business content first.

Tasks:

- Build service list page.
- Build create/edit service form.
- Support service publish/draft status.
- Support price, duration, rating, badges, categories, and WhatsApp message.
- Support equipment list editing.
- Support multiple image upload per service.
- Support optional service promo video.
- Support sorting services.
- Replace static service data usage with database-backed data.
- Keep fallback static data during transition if needed.

Done when:

- Admin can create, edit, reorder, publish, and unpublish services.
- Public `/services` renders published services from Supabase.
- Homepage service preview uses the same source.
- Build and lint pass.

## Phase 7 - Hero, Contact, and Business Profile CMS

Status: Done. Admin settings/profile forms are connected for hero copy, contact/location/social/map/SEO fields, and business profile text. Public hero, contact, and about pages read these CMS records with safe fallbacks.

Purpose: move high-impact single-record content into admin.

Tasks:

- Build hero editor.
- Build contact/location editor.
- Build about/profile editor.
- Support hero image/video upload.
- Support Google Maps embed update.
- Support WhatsApp, email, address, hours, and social links.
- Replace hardcoded constants where appropriate.

Done when:

- Admin can update hero, contact, and about content.
- Public pages reflect published settings.
- Existing WhatsApp CTAs still work.

## Phase 8 - Gallery CMS

Status: Done. Admin can upload photos/videos, edit category/caption/alt text/featured/status/order, and delete gallery records. Public gallery and homepage teaser read published Supabase gallery items with local fallback. Existing local gallery images were seeded into Supabase Storage/CMS.

Purpose: make gallery content manageable.

Tasks:

- Build gallery item list.
- Build upload flow for photos and videos.
- Support category, caption, alt text, featured flag, status, and sort order.
- Replace static gallery data with database-backed data.
- Keep lightbox behavior working.

Done when:

- Admin can upload and publish gallery media.
- Public `/gallery` renders published media.
- Homepage gallery teaser uses featured or latest published items.

## Phase 9 - FAQ CMS

Status: Done. Admin can create, edit, delete, categorize, sort, and publish/archive FAQs. Public FAQ page reads published Supabase FAQs with local fallback. Initial FAQs were seeded.

Purpose: make FAQ updates simple and low-risk.

Tasks:

- Build FAQ list.
- Build create/edit FAQ form.
- Support category, status, and sort order.
- Replace static FAQ data with database-backed data.

Done when:

- Admin can manage FAQs.
- Public `/faq` renders published FAQs.
- Accordion behavior still works.

## Phase 10 - Testimonials CMS

Status: Done. Admin can create, edit, delete, feature, publish/archive testimonials and upload optional guest images. Homepage now renders published testimonials when available. Initial testimonials were seeded.

Purpose: add review content after the core site content is manageable.

Tasks:

- Add testimonial section to homepage if not already present.
- Build testimonial admin list.
- Build create/edit testimonial form.
- Support guest name, origin, rating, review, image, related service, featured status, publish status.

Done when:

- Admin can manage testimonials.
- Published testimonials render on public pages.
- Empty state is handled if no testimonials are published.

## Phase 11 - SEO and Preview

Status: Done. Homepage metadata now uses CMS meta title/description and optional OG image. Admin preview mode is available through the dashboard, shows draft/non-archived CMS content to authorized admins, displays a preview banner, and sets robots noindex while active. Settings UI warns when required SEO fields are incomplete.

Purpose: improve publishing confidence and search visibility.

Tasks:

- Add editable meta title and meta description for key pages.
- Add OG image selection.
- Add alt text requirements for images.
- Add preview mode for draft content.
- Add validation for missing required SEO fields.

Done when:

- Admin can preview draft changes before publishing.
- Public metadata uses configured values.
- Image alt text is available where images render.

## Phase 12 - Hardening and Polish

Status: Done. Added schema hardening indexes/constraints, fixed database advisor security warnings under application control, added preview noindex behavior, kept upload validation, and verified final lint/build. One Supabase Auth dashboard-level advisory remains: leaked password protection must be enabled in Supabase project settings.

Purpose: prepare admin for real use.

Tasks:

- Add audit fields display where useful.
- Add optimistic UI only where safe.
- Add form validation with clear messages.
- Add admin-only error handling.
- Add database indexes for slug, status, and sort order.
- Add rate limits or server-side protections where appropriate.
- Verify RLS policies again.
- Run final lint and build.

Done when:

- Admin workflows feel complete.
- Public pages remain fast and stable.
- Security rules are verified.
- `npm run lint` passes.
- `npm run build` passes.

## Suggested Work Order

1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6
8. Phase 7
9. Phase 8
10. Phase 9
11. Phase 10
12. Phase 11
13. Phase 12

## Notes for Future Implementation

- Keep public pages working while migrating each content area.
- Prefer one content module per pull/change set.
- After moving a module to Supabase, remove only the static data that is no longer used.
- Use server-side reads for public pages where SEO matters.
- Use client-side admin forms for editing workflows.
- Avoid adding a complex role system until there is a real need for more than admin/editor.
