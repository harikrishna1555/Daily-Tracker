CREATE OR REPLACE FUNCTION soft_delete_row()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_deleted = TRUE;
  NEW.deleted_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
