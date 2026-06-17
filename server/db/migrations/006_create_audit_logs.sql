CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  old_value JSONB,
  new_value JSONB,
  changed_fields TEXT[],
  status VARCHAR(20) DEFAULT 'SUCCESS',
  failure_reason TEXT,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  performed_at TIMESTAMP DEFAULT NOW()
);

CREATE RULE no_update_audit AS
ON UPDATE TO audit_logs DO INSTEAD NOTHING;

CREATE RULE no_delete_audit AS
ON DELETE TO audit_logs DO INSTEAD NOTHING;
