export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role_id?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          tagline: string
          description: string | null
          status: 'in_development' | 'beta' | 'live' | 'sunset'
          category: string[]
          tech_stack: string[]
          body_color: string
          website_url: string | null
          github_url: string | null
          cover_image_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          tagline: string
          description?: string | null
          status?: 'in_development' | 'beta' | 'live' | 'sunset'
          category?: string[]
          tech_stack?: string[]
          body_color?: string
          website_url?: string | null
          github_url?: string | null
          cover_image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name?: string
          tagline?: string
          description?: string | null
          status?: 'in_development' | 'beta' | 'live' | 'sunset'
          category?: string[]
          tech_stack?: string[]
          body_color?: string
          website_url?: string | null
          github_url?: string | null
          cover_image_url?: string | null
          is_featured?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          deliverables: string[]
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description: string
          deliverables?: string[]
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name?: string
          description?: string
          deliverables?: string[]
          sort_order?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          event_type: 'hackathon' | 'workshop' | 'summit' | 'community' | 'other'
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          start_date: string
          end_date: string | null
          location: string
          is_hub_event: boolean
          cover_color: string
          cover_image_url: string | null
          youtube_url: string | null
          social_links: string[] | null
          registration_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          event_type?: 'hackathon' | 'workshop' | 'summit' | 'community' | 'other'
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          start_date: string
          end_date?: string | null
          location: string
          is_hub_event?: boolean
          cover_color?: string
          cover_image_url?: string | null
          youtube_url?: string | null
          social_links?: string[] | null
          registration_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          description?: string
          event_type?: 'hackathon' | 'workshop' | 'summit' | 'community' | 'other'
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string | null
          location?: string
          is_hub_event?: boolean
          cover_color?: string
          cover_image_url?: string | null
          youtube_url?: string | null
          social_links?: string[] | null
          registration_url?: string | null
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string
          post_type: 'editorial' | 'announcement' | 'product_update' | 'event_recap' | 'research' | 'recruitment'
          tags: string[]
          author: string
          author_id: string | null
          cover_image_url: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          content: string
          post_type?: 'editorial' | 'announcement' | 'product_update' | 'event_recap' | 'research' | 'recruitment'
          tags?: string[]
          author: string
          author_id?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          excerpt?: string
          content?: string
          post_type?: 'editorial' | 'announcement' | 'product_update' | 'event_recap' | 'research' | 'recruitment'
          tags?: string[]
          author?: string
          author_id?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          role_id: string | null
          name: string
          email: string
          cover_note: string | null
          cv_url: string | null
          role_title: string | null
          status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role_id?: string | null
          name: string
          email: string
          cover_note?: string | null
          cv_url?: string | null
          role_title?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          role_id?: string | null
          name?: string
          email?: string
          cover_note?: string | null
          cv_url?: string | null
          role_title?: string | null
          status?: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          slug: string
          name: string
          role: string
          bio: string | null
          detail: string | null
          photo_url: string | null
          email: string | null
          github_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          role: string
          bio?: string | null
          detail?: string | null
          photo_url?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          name?: string
          role?: string
          bio?: string | null
          detail?: string | null
          photo_url?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          organisation: string | null
          subject_type: 'services' | 'partnership' | 'investment' | 'press' | 'general'
          message: string
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          organisation?: string | null
          subject_type?: 'services' | 'partnership' | 'investment' | 'press' | 'general'
          message: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
        Update: {
          status?: 'new' | 'read' | 'replied' | 'archived'
        }
      }
      hub_projects: {
        Row: {
          id: string
          name: string
          team_name: string
          event_id: string | null
          description: string
          tags: string[]
          cover_color: string
          github_url: string | null
          website_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          team_name: string
          event_id?: string | null
          description: string
          tags?: string[]
          cover_color?: string
          github_url?: string | null
          website_url?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          team_name?: string
          event_id?: string | null
          description?: string
          tags?: string[]
          cover_color?: string
          github_url?: string | null
          website_url?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          slug: string
          title: string
          team: string
          type: 'full_time' | 'contract' | 'volunteer' | 'internship'
          location: string
          description: string
          requirements: string[]
          is_active: boolean
          closes_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          team: string
          type?: 'full_time' | 'contract' | 'volunteer' | 'internship'
          location: string
          description: string
          requirements?: string[]
          is_active?: boolean
          closes_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          team?: string
          type?: 'full_time' | 'contract' | 'volunteer' | 'internship'
          location?: string
          description?: string
          requirements?: string[]
          is_active?: boolean
          closes_at?: string | null
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
  }
}

// Convenience row types — import these directly in pages and components
export type Profile           = Database['public']['Tables']['profiles']['Row']
export type Product           = Database['public']['Tables']['products']['Row']
export type Service           = Database['public']['Tables']['services']['Row']
export type NTEvent           = Database['public']['Tables']['events']['Row']
export type Post              = Database['public']['Tables']['posts']['Row']
export type Application       = Database['public']['Tables']['applications']['Row']
export type TeamMember        = Database['public']['Tables']['team_members']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type HubProject        = Database['public']['Tables']['hub_projects']['Row']
export type Role              = Database['public']['Tables']['roles']['Row']
export type SiteSetting       = Database['public']['Tables']['site_settings']['Row']

export interface CommunityProject {
  id:          string
  slug:        string
  name:        string
  team:        string
  event:       string
  description: string
  tags:        string[]
  status:      string
  website_url: string | null
  github_url:  string | null
  cover_color: string
  is_featured: boolean
  sort_order:  number
  created_at:  string
  updated_at:  string
}

