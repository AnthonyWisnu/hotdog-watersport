export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          display_name: string | null;
          status: "active" | "disabled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          display_name?: string | null;
          status?: "active" | "disabled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          display_name?: string | null;
          status?: "active" | "disabled";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          bucket: string;
          path: string;
          media_type: "image" | "video";
          mime_type: string | null;
          size_bytes: number | null;
          alt_text: string | null;
          caption: string | null;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bucket?: string;
          path: string;
          media_type: "image" | "video";
          mime_type?: string | null;
          size_bytes?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          status?: "draft" | "published" | "archived";
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bucket?: string;
          path?: string;
          media_type?: "image" | "video";
          mime_type?: string | null;
          size_bytes?: number | null;
          alt_text?: string | null;
          caption?: string | null;
          status?: "draft" | "published" | "archived";
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          headline: string | null;
          description: string | null;
          category_labels: string[];
          price: string | null;
          duration: string | null;
          rating: number | null;
          badge: string | null;
          is_popular: boolean;
          equipment: string[];
          rental_info: string | null;
          operational_notes: string | null;
          whatsapp_message: string | null;
          sort_order: number;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          slug: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: [];
      };
      service_media: {
        Row: {
          id: string;
          service_id: string;
          media_asset_id: string;
          media_role: "cover" | "gallery" | "promo_video";
          alt_text: string | null;
          caption: string | null;
          sort_order: number;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_media"]["Row"]> & {
          service_id: string;
          media_asset_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["service_media"]["Row"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          settings_key: string;
          hero_title: string;
          hero_subtitle: string;
          hero_cta_text: string;
          hero_secondary_cta_text: string;
          logo_media_id: string | null;
          footer_logo_media_id: string | null;
          favicon_media_id: string | null;
          hero_media_id: string | null;
          whatsapp_number: string | null;
          business_email: string | null;
          location_city: string | null;
          location_address: string | null;
          operating_hours: string | null;
          maps_embed_url: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          tiktok_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image_id: string | null;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      business_profile: {
        Row: {
          id: string;
          profile_key: string;
          business_name: string;
          tagline: string | null;
          brand_story: string | null;
          about_text: string | null;
          values: Json;
          safety_commitment: string | null;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["business_profile"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["business_profile"]["Row"]>;
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          media_asset_id: string;
          category: string;
          alt_text: string | null;
          caption: string | null;
          is_featured: boolean;
          sort_order: number;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]> & {
          media_asset_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          sort_order: number;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & {
          question: string;
          answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          guest_name: string;
          guest_origin: string | null;
          rating: number;
          review: string;
          image_asset_id: string | null;
          related_service_id: string | null;
          reviewed_at: string | null;
          is_featured: boolean;
          sort_order: number;
          status: "draft" | "published" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & {
          guest_name: string;
          rating: number;
          review: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      taxonomies: {
        Row: {
          id: string;
          taxonomy_group:
            | "service_category"
            | "service_badge"
            | "gallery_category"
            | "faq_category";
          value: string;
          label: string;
          description: string | null;
          sort_order: number;
          status: "active" | "inactive" | "archived";
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["taxonomies"]["Row"]> & {
          taxonomy_group:
            | "service_category"
            | "service_badge"
            | "gallery_category"
            | "faq_category";
          value: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["taxonomies"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
