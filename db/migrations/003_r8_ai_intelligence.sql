BEGIN;

CREATE TABLE organization_ai_config(
  organization_id uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  automation_level text NOT NULL DEFAULT 'assist' CHECK(automation_level IN ('assist','drafts','drafts-and-tasks','approved')),
  provider text NOT NULL DEFAULT 'mock', model text NOT NULL DEFAULT 'server-default', config_version text NOT NULL DEFAULT 'r8-v1',
  per_operation_usd numeric(10,4) NOT NULL DEFAULT 1 CHECK(per_operation_usd>=0), daily_usd numeric(10,2) NOT NULL DEFAULT 10 CHECK(daily_usd>=0), monthly_usd numeric(10,2) NOT NULL DEFAULT 100 CHECK(monthly_usd>=0),
  retention_days integer NOT NULL DEFAULT 365 CHECK(retention_days BETWEEN 1 AND 3650), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 1
);
CREATE TABLE utility_documents(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, project_id text REFERENCES projects(id) ON DELETE SET NULL,
  filename text NOT NULL, mime_type text NOT NULL CHECK(mime_type IN ('application/pdf','image/jpeg','image/png')), byte_size integer NOT NULL CHECK(byte_size>0 AND byte_size<=15728640), page_count integer,
  sha256 text NOT NULL, content bytea NOT NULL, status text NOT NULL DEFAULT 'uploaded' CHECK(status IN ('uploaded','extracting','needs-review','validated','rejected','purge-pending','purged','failed')),
  extraction_schema_version integer, extraction jsonb, validation_issues jsonb NOT NULL DEFAULT '[]', review_blocked boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz,
  UNIQUE(organization_id,sha256)
);
CREATE INDEX utility_documents_org_project_idx ON utility_documents(organization_id,project_id,created_at DESC);
CREATE TABLE utility_field_corrections(
  id bigserial PRIMARY KEY, organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, document_id uuid NOT NULL REFERENCES utility_documents(id) ON DELETE CASCADE,
  field_path text NOT NULL, before_value jsonb, after_value jsonb NOT NULL, reason text, reviewer_user_id uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE consumption_history_entries(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id uuid REFERENCES utility_documents(id) ON DELETE SET NULL, period_start date NOT NULL, period_end date NOT NULL, kwh numeric(16,4) NOT NULL CHECK(kwh>=0), demand_kw numeric(16,4), power_factor numeric(8,6), provenance text NOT NULL CHECK(provenance IN ('bill','manual')),
  created_by uuid NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), CHECK(period_end>=period_start), UNIQUE(organization_id,project_id,document_id,period_start,period_end)
);
CREATE TABLE ai_executions(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, project_id text REFERENCES projects(id) ON DELETE SET NULL, document_id uuid REFERENCES utility_documents(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL, operation text NOT NULL, provider text NOT NULL, model text NOT NULL, config_version text NOT NULL, schema_version integer NOT NULL,
  status text NOT NULL CHECK(status IN ('running','succeeded','failed','blocked')), duration_ms integer, retries integer NOT NULL DEFAULT 0, input_tokens integer NOT NULL DEFAULT 0, output_tokens integer NOT NULL DEFAULT 0, estimated_cost_usd numeric(12,6) NOT NULL DEFAULT 0,
  error_category text, rationale jsonb, created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE INDEX ai_executions_usage_idx ON ai_executions(organization_id,created_at DESC);
CREATE TABLE ai_execution_steps(
  id bigserial PRIMARY KEY, execution_id uuid NOT NULL REFERENCES ai_executions(id) ON DELETE CASCADE, step_index integer NOT NULL, kind text NOT NULL, tool_name text, status text NOT NULL,
  duration_ms integer, input_meta jsonb, output_meta jsonb, error_category text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(execution_id,step_index)
);
CREATE TABLE ai_idempotency_keys(
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, operation text NOT NULL, idempotency_key text NOT NULL, result_resource_type text, result_resource_id text, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(organization_id,operation,idempotency_key)
);
CREATE TABLE ai_confirmation_tokens(
  token_hash text PRIMARY KEY, organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, action text NOT NULL, resource_id text NOT NULL, expires_at timestamptz NOT NULL, consumed_at timestamptz
);

INSERT INTO organization_ai_config(organization_id) SELECT id FROM organizations ON CONFLICT DO NOTHING;
INSERT INTO schema_migrations(version) VALUES('003_r8_ai_intelligence') ON CONFLICT DO NOTHING;
COMMIT;
