export type GalleryCategory =
  | "all"
  | "watersport"
  | "diving"
  | "snorkeling"
  | "tour";

export interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, "all">;
  type: "image" | "video";
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbnail?: string; // for video items
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "w01", category: "watersport", type: "image", src: "/images/gallery/jet-ski.jpg",               alt: "Jet ski speeding across the ocean",              width: 1200, height: 800 },
  { id: "w02", category: "watersport", type: "image", src: "/images/gallery/banana-boat.jpg",            alt: "Banana boat ride with excited guests",           width: 1200, height: 800 },
  { id: "w03", category: "watersport", type: "image", src: "/images/gallery/fly-board.jpg",              alt: "Flyboard soaring above the water surface",       width: 1200, height: 800 },
  { id: "w04", category: "watersport", type: "image", src: "/images/gallery/fly-fish.jpg",               alt: "Flying fish ride skimming across the waves",     width: 1200, height: 800 },
  { id: "w05", category: "watersport", type: "image", src: "/images/gallery/tubing.jpg",                 alt: "Tubing adventure pulled by a speedboat",         width: 1200, height: 800 },
  { id: "w06", category: "watersport", type: "image", src: "/images/gallery/wake-board.jpg",             alt: "Wakeboarding with spectacular wake spray",       width: 1200, height: 800 },
  { id: "w07", category: "watersport", type: "image", src: "/images/gallery/parasailing.jpg",            alt: "Parasailing high above the crystal-clear sea",   width: 1200, height: 800 },
  { id: "w08", category: "watersport", type: "image", src: "/images/gallery/parasailing-adventure.jpg",  alt: "Parasailing adventure along the coastline",      width: 1200, height: 800 },
  { id: "d01", category: "diving",     type: "image", src: "/images/gallery/scuba-diving.jpg",           alt: "Scuba diver exploring the vibrant coral reef",   width: 1200, height: 800 },
  { id: "d02", category: "diving",     type: "image", src: "/images/gallery/manta-dive.jpg",             alt: "Diving alongside a graceful manta ray",          width: 1200, height: 800 },
  { id: "d03", category: "diving",     type: "image", src: "/images/gallery/mola-mola-dive.jpg",         alt: "Underwater encounter with a mola mola sunfish",  width: 1200, height: 800 },
  { id: "d04", category: "diving",     type: "image", src: "/images/gallery/sea-walker.png",             alt: "Sea walker exploring the ocean floor with helmet", width: 1200, height: 800 },
  { id: "d05", category: "diving",     type: "image", src: "/images/gallery/planting-coral.jpg",         alt: "Guests participating in coral planting activity", width: 1200, height: 800 },
  { id: "s01", category: "snorkeling", type: "image", src: "/images/gallery/snorkeling.jpg",             alt: "Snorkeling through shallow tropical reef waters", width: 1200, height: 800 },
  { id: "t01", category: "tour",       type: "image", src: "/images/gallery/glass-bottom-boat.jpg",      alt: "Glass bottom boat revealing the underwater world", width: 1200, height: 800 },
  { id: "t02", category: "tour",       type: "image", src: "/images/gallery/mangrove-tour.jpg",          alt: "Mangrove tour through lush coastal forest",      width: 1200, height: 800 },
];

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "all",        label: "All" },
  { id: "watersport", label: "Water Sports" },
  { id: "diving",     label: "Diving" },
  { id: "snorkeling", label: "Snorkeling" },
  { id: "tour",       label: "Tours" },
];

export const GALLERY_PAGE_SIZE = 12;
