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
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string | null;
          role: "Admin" | "Resident";
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          name?: string | null;
          role?: "Admin" | "Resident";
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
          role?: "Admin" | "Resident";
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          is_pinned: boolean;
          author_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          content: string;
          is_pinned?: boolean;
          author_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          content?: string;
          is_pinned?: boolean;
          author_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      maintenance_requests: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          status: "pending" | "in_progress" | "resolved";
          image_url: string | null;
          resident_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          status?: "pending" | "in_progress" | "resolved";
          image_url?: string | null;
          resident_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          status?: "pending" | "in_progress" | "resolved";
          image_url?: string | null;
          resident_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_resident_id_fkey";
            columns: ["resident_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          category: "Rules" | "Financial reports" | "Meeting reports";
          file_url: string;
          uploaded_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          category: "Rules" | "Financial reports" | "Meeting reports";
          file_url: string;
          uploaded_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          category?: "Rules" | "Financial reports" | "Meeting reports";
          file_url?: string;
          uploaded_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          resident_id: string;
          amount: number;
          month: string;
          status: "paid" | "unpaid";
        };
        Insert: {
          id?: string;
          created_at?: string;
          resident_id: string;
          amount: number;
          month: string;
          status?: "paid" | "unpaid";
        };
        Update: {
          id?: string;
          created_at?: string;
          resident_id?: string;
          amount?: number;
          month?: string;
          status?: "paid" | "unpaid";
        };
        Relationships: [
          {
            foreignKeyName: "payments_resident_id_fkey";
            columns: ["resident_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
