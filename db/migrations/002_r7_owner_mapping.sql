BEGIN;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS legacy_owner_id text;
CREATE UNIQUE INDEX IF NOT EXISTS memberships_org_legacy_owner_idx ON memberships(organization_id,legacy_owner_id) WHERE legacy_owner_id IS NOT NULL;
INSERT INTO schema_migrations(version) VALUES('002_r7_owner_mapping') ON CONFLICT DO NOTHING;
COMMIT;
