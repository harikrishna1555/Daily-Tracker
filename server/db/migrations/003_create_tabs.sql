CREATE TABLE tabs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INT REFERENCES users(id),
  deleted_at TIMESTAMP,
  deleted_by INT REFERENCES users(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_tabs_user_id ON tabs(user_id);
