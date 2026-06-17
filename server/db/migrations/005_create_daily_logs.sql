CREATE TABLE daily_logs (
  id SERIAL PRIMARY KEY,
  activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  UNIQUE(activity_id, user_id, log_date),
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

CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date);
