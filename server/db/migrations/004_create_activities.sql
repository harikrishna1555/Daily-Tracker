CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  tab_id INT REFERENCES tabs(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
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

CREATE INDEX idx_activities_tab_id ON activities(tab_id);
