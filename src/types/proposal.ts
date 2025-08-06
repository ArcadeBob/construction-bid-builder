// Core enums matching database enums
export enum ProjectType {
  STOREFRONT_INSTALLATION = 'storefront_installation',
  CURTAIN_WALL = 'curtain_wall',
  GLASS_DOORS = 'glass_doors',
  GLASS_RAILINGS = 'glass_railings',
  SHOWERS = 'showers',
  GLASS_CANOPIES = 'glass_canopies',
  CUSTOM_INSTALLATION = 'custom_installation'
}

export enum ProposalStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  READY_TO_SEND = 'ready_to_send',
  SENT = 'sent'
}

export enum LineItemCategory {
  MATERIAL = 'material',
  LABOR = 'labor',
  EQUIPMENT = 'equipment',
  OVERHEAD = 'overhead',
  PROFIT = 'profit',
  CUSTOM = 'custom'
}

export enum SectionType {
  PROJECT_DETAILS = 'project_details',
  TECHNICAL_SPECIFICATIONS = 'technical_specifications',
  RISK_ASSESSMENT = 'risk_assessment',
  TIMELINE = 'timeline',
  WARRANTY = 'warranty',
  TERMS_CONDITIONS = 'terms_conditions'
}

// Base interfaces for database entities
export interface Contractor {
  id: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  contractor_id: string;
  project_type: ProjectType;
  status: ProposalStatus;
  
  // Client information
  client_name: string;
  client_contact_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  
  // Project information
  project_name: string;
  project_address?: string;
  project_description?: string;
  
  // Pricing totals
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  
  // Workflow tracking
  internal_notes?: string;
  review_notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  sent_at?: string;
}

export interface ProposalLineItem {
  id: string;
  proposal_id: string;
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  is_manual_override: boolean;
  material_id?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalSection {
  id: string;
  proposal_id: string;
  section_type: SectionType;
  title: string;
  content: Record<string, any>; // JSONB content
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalAutoSave {
  id: string;
  proposal_id: string;
  snapshot_data: Record<string, any>; // JSONB snapshot
  created_at: string;
}

// Input types for creating/updating entities
export interface CreateContractorInput {
  email: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  logo_url?: string;
}

export interface UpdateContractorInput {
  company_name?: string;
  contact_name?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
}

export interface CreateProposalInput {
  project_type: ProjectType;
  client_name: string;
  client_contact_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  project_name: string;
  project_address?: string;
  project_description?: string;
  tax_rate?: number;
}

export interface UpdateProposalInput {
  project_type?: ProjectType;
  status?: ProposalStatus;
  client_name?: string;
  client_contact_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  project_name?: string;
  project_address?: string;
  project_description?: string;
  tax_rate?: number;
  internal_notes?: string;
  review_notes?: string;
}

export interface CreateLineItemInput {
  proposal_id: string;
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  is_manual_override?: boolean;
  material_id?: string;
  order_index?: number;
}

export interface UpdateLineItemInput {
  category?: LineItemCategory;
  description?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  is_manual_override?: boolean;
  material_id?: string;
  order_index?: number;
}

export interface CreateSectionInput {
  proposal_id: string;
  section_type: SectionType;
  title: string;
  content: Record<string, any>;
  order_index?: number;
}

export interface UpdateSectionInput {
  title?: string;
  content?: Record<string, any>;
  order_index?: number;
}

// Extended types with relationships
export interface ProposalWithDetails extends Proposal {
  contractor: Contractor;
  line_items: ProposalLineItem[];
  sections: ProposalSection[];
}

export interface ProposalListItem {
  id: string;
  project_name: string;
  client_name: string;
  project_type: ProjectType;
  status: ProposalStatus;
  total_amount: number;
  updated_at: string;
  created_at: string;
}

// Content schemas for different section types
export interface ProjectDetailsContent {
  square_footage?: number;
  story_height?: number;
  access_requirements?: string;
  special_conditions?: string;
  delivery_date?: string;
  installation_timeline?: string;
}

export interface TechnicalSpecificationsContent {
  glass_type?: string;
  glass_thickness?: string;
  aluminum_system?: string;
  performance_ratings?: {
    wind_load?: string;
    water_penetration?: string;
    air_infiltration?: string;
    structural_glazing?: string;
  };
  hardware_specifications?: string;
  finish_specifications?: string;
}

export interface RiskAssessmentContent {
  site_conditions?: {
    access_limitations?: string;
    weather_considerations?: string;
    existing_structure_condition?: string;
  };
  project_risks?: {
    delivery_delays?: string;
    material_availability?: string;
    labor_availability?: string;
    permit_requirements?: string;
  };
  mitigation_strategies?: {
    contingency_plans?: string;
    alternative_materials?: string;
    schedule_buffers?: string;
  };
}

export interface TimelineContent {
  project_phases?: {
    phase: string;
    duration: string;
    start_date?: string;
    end_date?: string;
    dependencies?: string[];
  }[];
  critical_milestones?: {
    milestone: string;
    date: string;
    description?: string;
  }[];
  weather_considerations?: string;
  permit_timeline?: string;
}

export interface WarrantyContent {
  material_warranty?: {
    duration: string;
    coverage: string;
    exclusions?: string[];
  };
  workmanship_warranty?: {
    duration: string;
    coverage: string;
    exclusions?: string[];
  };
  maintenance_requirements?: string;
  warranty_transfer?: string;
}

export interface TermsConditionsContent {
  payment_terms?: {
    deposit_percentage?: number;
    progress_payments?: {
      percentage: number;
      milestone: string;
    }[];
    final_payment?: string;
  };
  change_order_process?: string;
  force_majeure?: string;
  dispute_resolution?: string;
  governing_law?: string;
}

// Union type for all section content
export type SectionContent = 
  | ProjectDetailsContent
  | TechnicalSpecificationsContent
  | RiskAssessmentContent
  | TimelineContent
  | WarrantyContent
  | TermsConditionsContent;

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Filter and query types
export interface ProposalFilters {
  status?: ProposalStatus[];
  project_type?: ProjectType[];
  client_name?: string;
  created_after?: string;
  created_before?: string;
  updated_after?: string;
  updated_before?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface ProposalSortOptions {
  field: 'created_at' | 'updated_at' | 'project_name' | 'client_name' | 'total_amount';
  direction: 'asc' | 'desc';
}

export interface ProposalQuery {
  filters?: ProposalFilters;
  sort?: ProposalSortOptions;
  page?: number;
  limit?: number;
  search?: string;
}

// Utility types for forms
export interface ProposalFormData extends Omit<CreateProposalInput, 'project_type'> {
  project_type: string; // For form compatibility
}

export interface LineItemFormData extends Omit<CreateLineItemInput, 'proposal_id' | 'category'> {
  category: string; // For form compatibility
}

// Constants for UI
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [ProjectType.STOREFRONT_INSTALLATION]: 'Storefront Installation',
  [ProjectType.CURTAIN_WALL]: 'Curtain Wall',
  [ProjectType.GLASS_DOORS]: 'Glass Doors',
  [ProjectType.GLASS_RAILINGS]: 'Glass Railings',
  [ProjectType.SHOWERS]: 'Showers',
  [ProjectType.GLASS_CANOPIES]: 'Glass Canopies',
  [ProjectType.CUSTOM_INSTALLATION]: 'Custom Installation'
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  [ProposalStatus.DRAFT]: 'Draft',
  [ProposalStatus.REVIEW]: 'Under Review',
  [ProposalStatus.READY_TO_SEND]: 'Ready to Send',
  [ProposalStatus.SENT]: 'Sent'
};

export const LINE_ITEM_CATEGORY_LABELS: Record<LineItemCategory, string> = {
  [LineItemCategory.MATERIAL]: 'Material',
  [LineItemCategory.LABOR]: 'Labor',
  [LineItemCategory.EQUIPMENT]: 'Equipment',
  [LineItemCategory.OVERHEAD]: 'Overhead',
  [LineItemCategory.PROFIT]: 'Profit',
  [LineItemCategory.CUSTOM]: 'Custom'
};

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  [SectionType.PROJECT_DETAILS]: 'Project Details',
  [SectionType.TECHNICAL_SPECIFICATIONS]: 'Technical Specifications',
  [SectionType.RISK_ASSESSMENT]: 'Risk Assessment',
  [SectionType.TIMELINE]: 'Timeline',
  [SectionType.WARRANTY]: 'Warranty',
  [SectionType.TERMS_CONDITIONS]: 'Terms & Conditions'
};

// Validation schemas (for use with form libraries)
export const DEFAULT_UNITS = [
  'each',
  'sq ft',
  'lin ft',
  'cu ft',
  'hour',
  'day',
  'week',
  'lb',
  'ton'
] as const;

export type DefaultUnit = typeof DEFAULT_UNITS[number];

// Auto-save configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  maxRetries: number;
  debounceDelay: number;
}

export const DEFAULT_AUTO_SAVE_CONFIG: AutoSaveConfig = {
  enabled: true,
  interval: 30000, // 30 seconds
  maxRetries: 3,
  debounceDelay: 1000 // 1 second
};