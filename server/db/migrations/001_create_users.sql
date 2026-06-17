CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INT,
  deleted_at TIMESTAMP,
  deleted_by INT,
  is_deleted BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT
);

ALTER TABLE users
ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
ADD CONSTRAINT fk_users_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id);
