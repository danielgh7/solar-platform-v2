BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations(
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organizations(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  short_name text NOT NULL,
  legal_name text,
  default_locale text NOT NULL DEFAULT 'es-MX' CHECK(default_locale IN ('es-MX','en-US')),
  default_currency text NOT NULL DEFAULT 'MXN',
  timezone text NOT NULL DEFAULT 'America/Mexico_City',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE organization_branding(
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  tagline text NOT NULL DEFAULT 'Energía que conecta.',
  primary_color text NOT NULL DEFAULT '#0295BF',
  secondary_color text NOT NULL DEFAULT '#007FB8',
  accent_color text NOT NULL DEFAULT '#0780AD',
  graphite_color text NOT NULL DEFAULT '#464647',
  dark_graphite_color text NOT NULL DEFAULT '#3D4247',
  surface_color text NOT NULL DEFAULT '#FFFFFF',
  website text,
  email text,
  phone text,
  footer_text text,
  logo_asset_id uuid,
  favicon_asset_id uuid,
  proposal_defaults jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE organization_assets(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK(kind IN ('logo','favicon')),
  filename text NOT NULL,
  mime_type text NOT NULL CHECK(mime_type IN ('image/png','image/jpeg','image/webp')),
  byte_size integer NOT NULL CHECK(byte_size>0 AND byte_size<=2097152),
  content bytea NOT NULL,
  sha256 text NOT NULL,
  width integer,
  height integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id,sha256)
);
ALTER TABLE organization_branding ADD CONSTRAINT organization_branding_logo_fk FOREIGN KEY(logo_asset_id) REFERENCES organization_assets(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE organization_branding ADD CONSTRAINT organization_branding_favicon_fk FOREIGN KEY(favicon_asset_id) REFERENCES organization_assets(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE membership_role AS ENUM ('Admin','Commercial','Engineering','Operations','Viewer');
CREATE TABLE memberships(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role membership_role NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id,user_id)
);

CREATE TABLE user_preferences(
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  locale text CHECK(locale IN ('es-MX','en-US')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,organization_id)
);

CREATE TABLE sessions(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip_hash text
);
CREATE INDEX sessions_token_hash_idx ON sessions(token_hash);
CREATE INDEX sessions_expires_idx ON sessions(expires_at);

CREATE TABLE projects(
  id text PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  customer_name text,
  location text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  UNIQUE(organization_id,id)
);
CREATE INDEX projects_org_idx ON projects(organization_id);

CREATE TABLE project_states(
  project_id text PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  schema_version integer NOT NULL DEFAULT 1,
  r1 jsonb NOT NULL DEFAULT '{}'::jsonb,
  r2 jsonb NOT NULL DEFAULT '{}'::jsonb,
  r3 jsonb NOT NULL DEFAULT '{}'::jsonb,
  r4 jsonb NOT NULL DEFAULT '{}'::jsonb,
  r5 jsonb NOT NULL DEFAULT '{}'::jsonb,
  r6 jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);
CREATE INDEX project_states_org_idx ON project_states(organization_id);

CREATE TABLE business_records(
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  id text NOT NULL,
  project_id text REFERENCES projects(id) ON DELETE SET NULL,
  status text,
  owner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  PRIMARY KEY(organization_id,record_type,id)
);
CREATE INDEX business_records_org_type_idx ON business_records(organization_id,record_type);
CREATE INDEX business_records_project_idx ON business_records(project_id);
CREATE INDEX business_records_status_idx ON business_records(organization_id,record_type,status);

CREATE TABLE proposal_versions(
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  proposal_id text NOT NULL,
  version_number integer NOT NULL,
  status text NOT NULL,
  canonical_snapshot jsonb NOT NULL,
  branding_snapshot jsonb NOT NULL,
  locale text NOT NULL DEFAULT 'es-MX',
  pdf_sha256 text,
  exported_at timestamptz,
  frozen_at timestamptz,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(organization_id,proposal_id,version_number),
  UNIQUE(organization_id,project_id,proposal_id,version_number)
);
CREATE INDEX proposal_versions_project_idx ON proposal_versions(organization_id,project_id);

CREATE TABLE audit_entries(
  id bigserial PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  event_type text NOT NULL,
  before_meta jsonb,
  after_meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_entries_org_resource_idx ON audit_entries(organization_id,resource_type,resource_id,created_at DESC);

INSERT INTO schema_migrations(version) VALUES('001_r7_foundation') ON CONFLICT DO NOTHING;
COMMIT;
