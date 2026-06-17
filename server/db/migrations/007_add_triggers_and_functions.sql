CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_refresh_tokens_updated_at BEFORE UPDATE ON refresh_tokens
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_password_reset_tokens_updated_at BEFORE UPDATE ON password_reset_tokens
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tabs_updated_at BEFORE UPDATE ON tabs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_activities_updated_at BEFORE UPDATE ON activities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_daily_logs_updated_at BEFORE UPDATE ON daily_logs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
