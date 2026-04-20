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
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          name?: string | null;
          role?: "Admin" | "Resident";
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
          role?: "Admin" | "Resident";
        };
      };
      announcements: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          author_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          content: string;
          author_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          content?: string;
          author_id?: string;
        };
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
  };
}
