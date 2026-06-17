-- Replace placeholders before execution
INSERT INTO users (
  name,
  email,
  password_hash,
  role,
  created_at
)
VALUES (
  'Developer',
  'developer@example.com',
  '$2b$12$REPLACE_WITH_BCRYPT_HASH',
  'developer',
  NOW()
)
ON CONFLICT (email) DO NOTHING;
