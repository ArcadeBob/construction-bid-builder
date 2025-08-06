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
      contractors: {
        Row: {
          id: string;
          email: string;
          company_name: string;
          contact_name: string;
          phone: string | null;
          address: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company_name: string;
          contact_name: string;
          phone?: string | null;
          address?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string;
          contact_name?: string;
          phone?: string | null;
          address?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          contractor_id: string;
          project_type: Database['public']['Enums']['project_type'];
          status: Database['public']['Enums']['proposal_status'];
          client_name: string;
          client_contact_name: string | null;
          client_email: string | null;
          client_phone: string | null;
          client_address: string | null;
          project_name: string;
          project_address: string | null;
          project_description: string | null;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total_amount: number;
          internal_notes: string | null;
          review_notes: string | null;
          created_at: string;
          updated_at: string;
          reviewed_at: string | null;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          contractor_id: string;
          project_type: Database['public']['Enums']['project_type'];
          status?: Database['public']['Enums']['proposal_status'];
          client_name: string;
          client_contact_name?: string | null;
          client_email?: string | null;
          client_phone?: string | null;
          client_address?: string | null;
          project_name: string;
          project_address?: string | null;
          project_description?: string | null;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount?: number;
          internal_notes?: string | null;
          review_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          contractor_id?: string;
          project_type?: Database['public']['Enums']['project_type'];
          status?: Database['public']['Enums']['proposal_status'];
          client_name?: string;
          client_contact_name?: string | null;
          client_email?: string | null;
          client_phone?: string | null;
          client_address?: string | null;
          project_name?: string;
          project_address?: string | null;
          project_description?: string | null;
          subtotal?: number;
          tax_rate?: number;
          tax_amount?: number;
          total_amount?: number;
          internal_notes?: string | null;
          review_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_contractor_id_fkey";
            columns: ["contractor_id"];
            isOneToOne: false;
            referencedRelation: "contractors";
            referencedColumns: ["id"];
          }
        ];
      };
      proposal_line_items: {
        Row: {
          id: string;
          proposal_id: string;
          category: Database['public']['Enums']['line_item_category'];
          description: string;
          quantity: number;
          unit: string;
          unit_price: number;
          total: number;
          is_manual_override: boolean;
          material_id: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          category: Database['public']['Enums']['line_item_category'];
          description: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total?: number;
          is_manual_override?: boolean;
          material_id?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          category?: Database['public']['Enums']['line_item_category'];
          description?: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total?: number;
          is_manual_override?: boolean;
          material_id?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_line_items_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          }
        ];
      };
      proposal_sections: {
        Row: {
          id: string;
          proposal_id: string;
          section_type: Database['public']['Enums']['section_type'];
          title: string;
          content: Json;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          section_type: Database['public']['Enums']['section_type'];
          title: string;
          content?: Json;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          section_type?: Database['public']['Enums']['section_type'];
          title?: string;
          content?: Json;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_sections_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          }
        ];
      };
      proposal_auto_saves: {
        Row: {
          id: string;
          proposal_id: string;
          snapshot_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          snapshot_data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          snapshot_data?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_auto_saves_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_proposal_totals: {
        Args: {
          proposal_uuid: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      project_type: 
        | 'storefront_installation'
        | 'curtain_wall'
        | 'glass_doors'
        | 'glass_railings'
        | 'showers'
        | 'glass_canopies'
        | 'custom_installation';
      proposal_status: 'draft' | 'review' | 'ready_to_send' | 'sent';
      line_item_category: 
        | 'material'
        | 'labor'
        | 'equipment'
        | 'overhead'
        | 'profit'
        | 'custom';
      section_type: 
        | 'project_details'
        | 'technical_specifications'
        | 'risk_assessment'
        | 'timeline'
        | 'warranty'
        | 'terms_conditions';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database['public']['Tables'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database['public']['Tables'])[TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database['public']['Tables'])[TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;
