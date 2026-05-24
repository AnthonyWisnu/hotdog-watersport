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

## Phase 13 - Media Library and Logo CMS

Status: Done. Added `/admin/media` for reusable Supabase Storage assets, media upload/edit/archive/safe delete, usage labels, logo/footer logo/favicon selection in settings, CMS-powered header/footer logos, metadata favicon support, and a seed script for the existing local logo fallback.

Purpose: make Supabase Storage the primary source for production media and let admins manage reusable assets from one place.

Tasks:

- Add `/admin/media`.
- Build media library list with image/video filters.
- Support search by filename, alt text, caption, media type, and status.
- Support upload from media library.
- Support edit alt text, caption, and status.
- Support archive/delete media assets safely.
- Show where each media asset is used when possible.
- Add logo management to `/admin/settings`.
- Support main logo, footer logo, favicon, and OG image from media library.
- Add image preview for current logo/media selections.
- Store logo relationships in `site_settings`.
- Render header/footer logo from CMS settings.
- Keep local `/public/logo/logo.jpg` only as development/fallback asset.

Suggested schema changes:

- Add `site_settings.logo_media_id`.
- Add `site_settings.footer_logo_media_id`.
- Add `site_settings.favicon_media_id`.
- Add indexes for those media references.

Done when:

- Admin can upload, browse, edit, and reuse media from `/admin/media`.
- Admin can replace the site logo without touching files.
- Header and footer use CMS logo when configured.
- Favicon/OG image can be managed from admin.
- Production visuals no longer require manually placing new files under `/public`.

## Phase 14 - Controlled Taxonomy

Status: Done. Added shared taxonomy constants, replaced free-text service categories/badges, gallery categories, and FAQ categories with checkbox/dropdown controls, added server-side taxonomy validation, and migrated existing category values. Phase 16 supersedes the temporary static database check constraints with database-backed taxonomy validation.

Purpose: replace free-text category and badge inputs with controlled dropdowns/multiselects so admin data stays consistent.

Tasks:

- Add taxonomy tables or constants for controlled options.
- Add service category options such as:
  - Speed
  - Adrenaline Rush
  - Sky Experience
  - Fun & Leisure
  - Ocean Discovery
  - Family Friendly
  - Beginner Friendly
- Add gallery category options such as:
  - Water Sports
  - Diving
  - Snorkeling
  - Tours
  - Promo
  - Facility
- Add FAQ category options such as:
  - General
  - Booking
  - Safety
  - Equipment
  - Location
  - Payment
- Add badge options such as:
  - None
  - Popular
  - Best Seller
  - New
  - Limited
- Replace category text inputs with dropdowns, checkboxes, or multiselect controls.
- Replace badge text inputs with dropdowns.
- Add validation so invalid taxonomy values cannot be saved.
- Migrate existing seeded category strings to the controlled values.

Done when:

- Admin no longer types category/badge values manually.
- Public filters use controlled taxonomy data.
- Existing services, gallery items, and FAQs map cleanly to controlled categories.
- Invalid category/badge values are rejected by server-side admin validation.

## Phase 15 - Remove Public Asset Dependency

Status: Done. Added admin best-practice guidance, strengthened publish validation, made service uploads role-aware with cover/gallery/promo video support, required service cover images before publish, required alt text for published gallery items, added database safety constraints, and shifted homepage/about/service fallbacks toward CMS media before local `/public` fallbacks.

Purpose: make admin-managed Supabase media the production source of truth while keeping local assets only as safe fallbacks.

Tasks:

- Audit all remaining direct `/public/images`, `/public/videos`, and `/public/logo` references.
- Replace production-facing image/video usage with CMS media where available.
- Keep fallback media only for development or empty CMS states.
- Add publish validation rules:
  - Service cannot publish without at least one cover image.
  - Gallery item cannot publish without media and alt text.
  - Hero should warn before publish if no CMS media is selected.
  - Logo should warn if no CMS logo is selected.
- Add admin empty states explaining which required media is missing.
- Add optional one-time seed/import script for existing local assets.
- Document that new production media must be uploaded through admin.

Done when:

- New production media changes are fully possible through admin.
- No normal admin workflow requires copying files into `/public`.
- Public pages still render cleanly if CMS media is missing.
- `npm run lint` passes.
- `npm run build` passes.

## Phase 16 - Taxonomy CMS

Status: Done. Added `taxonomies` table with RLS, seeded existing controlled options, added `/admin/taxonomy`, wired service/gallery/FAQ admin forms to active taxonomy records, moved public service/gallery/FAQ filters to CMS taxonomy data, added server-side active taxonomy validation, and protected used values from unsafe deletion/value changes.

Purpose: move controlled category and badge options out of code and into the admin, so future service/gallery/FAQ taxonomy changes do not require developer edits.

Taxonomy groups to manage:

- Service categories
- Service badges
- Gallery categories
- FAQ categories

Recommended schema:

- `taxonomies`
  - `id`
  - `taxonomy_group` such as `service_category`, `service_badge`, `gallery_category`, `faq_category`
  - `value` internal slug used by existing content
  - `label` admin/public display label
  - `description`
  - `sort_order`
  - `status` such as `active`, `inactive`, `archived`
  - `created_by`
  - `updated_by`
  - `created_at`
  - `updated_at`

Tasks:

- Create taxonomy database table with RLS.
- Seed current values from `lib/taxonomy.ts`.
- Add `/admin/taxonomy` or `/admin/categories`.
- Build grouped list view for service categories, service badges, gallery categories, and FAQ categories.
- Support create, edit, archive, and reorder with Move Up/Move Down.
- Replace hardcoded taxonomy reads with database-backed reads.
- Keep fallback defaults from `lib/taxonomy.ts` if taxonomy records are missing.
- Update service category checkboxes and badge dropdown to read active taxonomy options.
- Update gallery category dropdown to read active taxonomy options.
- Update FAQ category dropdown to read active taxonomy options.
- Validate submitted taxonomy values against active database records.
- Prevent deleting taxonomy values that are still used by services, gallery items, or FAQs.
- Prefer archive/inactive over hard delete for values that may exist in historical content.
- Add empty states that explain when no active options exist for a taxonomy group.

Done when:

- Admin can manage service/gallery/FAQ categories and service badges without editing code.
- Existing content keeps working after taxonomy values are seeded.
- Forms only show active taxonomy options.
- Used taxonomy values cannot be accidentally deleted.
- Public pages render labels from the taxonomy CMS where appropriate.
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
14. Phase 13
15. Phase 14
16. Phase 15
17. Phase 16

## Notes for Future Implementation

- Keep public pages working while migrating each content area.
- Prefer one content module per pull/change set.
- After moving a module to Supabase, remove only the static data that is no longer used.
- Use server-side reads for public pages where SEO matters.
- Use client-side admin forms for editing workflows.
- Avoid adding a complex role system until there is a real need for more than admin/editor.
- Treat `/public` assets as fallback/dev assets after Phase 15, not as the production content workflow.
