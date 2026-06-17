-- Example default tabs
INSERT INTO tabs (user_id,name,icon,position)
SELECT id,'Health','heart',1 FROM users
ON CONFLICT DO NOTHING;
