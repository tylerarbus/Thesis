module.exports = (db) => {
  return db.query("CREATE TABLE IF NOT EXISTS users(\
    user_id SERIAL PRIMARY KEY,\
    email VARCHAR(30) NOT NULL UNIQUE,\
    first_name VARCHAR(20) NOT NULL,\
    last_name VARCHAR(20) NOT NULL,\
    password VARCHAR(200) NOT NULL,\
    phone VARCHAR(20),\
    phone_verified BOOLEAN DEFAULT false,\
    created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\
    modified TIMESTAMPTZ\
    );")
  .then(() => {
    return db.query("CREATE TABLE IF NOT EXISTS audio(\
      audio_id SERIAL PRIMARY KEY,\
      audio_path VARCHAR(20) NOT NULL,\
      is_processed BOOLEAN DEFAULT FALSE,\
      created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\
      modified TIMESTAMPTZ\
      );")
  })
  .then(() => {
    return db.query("CREATE TABLE IF NOT EXISTS entries(\
      entry_id SERIAL PRIMARY KEY,\
      user_id INT NOT NULL REFERENCES users,\
      audio_id INT REFERENCES audio,\
      created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\
      modified TIMESTAMPTZ\
      );")
  })
  .then(() => {
    return db.query("CREATE TABLE IF NOT EXISTS entry_text(\
      entry_text_id SERIAL PRIMARY KEY,\
      entry_id INT NOT NULL REFERENCES entries,\
      text TEXT,\
      created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\
      modified TIMESTAMPTZ\
      );")
  })
  .then(() => {
    // entry_id INT NOT NULL REFERENCES entries,\
    return db.query("CREATE TABLE IF NOT EXISTS sentiment(\
      sentiment_id SERIAL PRIMARY KEY,\
      value REAL,\
      created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,\
      modified TIMESTAMPTZ\
      );")
  })
  .then(() => {
    return db.query("CREATE OR REPLACE FUNCTION update_modified_column()\
      RETURNS TRIGGER AS $$\
      BEGIN\
         NEW.modified = now(); \
         RETURN NEW;\
      END;\
      $$ language 'plpgsql';")
    })
  .then(() => {
    return db.query("DROP TRIGGER IF EXISTS update_users_changetimestamp ON users")
  })
  .then(() => {
    return db.query("DROP TRIGGER IF EXISTS update_audio_changetimestamp ON audio")
  })
  .then(() => {
    return db.query("DROP TRIGGER IF EXISTS update_entries_changetimestamp ON entries")
  })
  .then(() => {
    return db.query("DROP TRIGGER IF EXISTS update_entry_text_changetimestamp ON entry_text")
  })
  .then(() => {
    return db.query("DROP TRIGGER IF EXISTS update_sentiment_changetimestamp ON sentiment")
  })
  .then(() => {
    return db.query("CREATE TRIGGER update_users_changetimestamp BEFORE UPDATE\
      ON users FOR EACH ROW EXECUTE PROCEDURE \
      update_modified_column();")
  })
  .then(() => {
    return db.query("CREATE TRIGGER update_audio_changetimestamp BEFORE UPDATE\
      ON audio FOR EACH ROW EXECUTE PROCEDURE \
      update_modified_column();")
  })
  .then(() => {
    return db.query("CREATE TRIGGER update_entries_changetimestamp BEFORE UPDATE\
      ON entries FOR EACH ROW EXECUTE PROCEDURE \
      update_modified_column();")
  })
  .then(() => {
    return db.query("CREATE TRIGGER update_entry_text_changetimestamp BEFORE UPDATE\
      ON entry_text FOR EACH ROW EXECUTE PROCEDURE \
      update_modified_column();")
  })
  .then(() => {
    return db.query("CREATE TRIGGER update_sentiment_changetimestamp BEFORE UPDATE\
      ON sentiment FOR EACH ROW EXECUTE PROCEDURE \
      update_modified_column();")
  })
}

