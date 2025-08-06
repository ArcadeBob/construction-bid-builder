# Supabase Migrations

This directory contains database migrations for the Construction Bid Builder project.

## Migrations

### 001_create_proposals_schema.sql
Creates the complete proposal management schema including:

- **contractors**: Company and contact information
- **proposals**: Core proposal data with workflow states
- **proposal_line_items**: Individual pricing line items
- **proposal_sections**: Flexible content sections (JSON)
- **proposal_auto_saves**: Auto-save history tracking

#### Key Features
- Row Level Security (RLS) policies for data isolation
- Automatic total calculation triggers
- Auto-save history management (last 10 saves)
- Comprehensive indexing for performance
- Proper foreign key relationships and constraints

#### Enums
- `project_type`: 7 glazing project types
- `proposal_status`: Draft → Review → Ready to Send → Sent
- `line_item_category`: Material, Labor, Equipment, Overhead, Profit, Custom
- `section_type`: Different content section types

## Running Migrations

To apply migrations to your Supabase instance:

1. Connect to your Supabase project
2. Run the SQL migration files in order
3. Verify RLS policies are active
4. Test with sample data

## TypeScript Types

The corresponding TypeScript types are available in:
- `src/types/database.ts` - Auto-generated Supabase types
- `src/types/proposal.ts` - Business logic types and interfaces