-- usersテーブルを作成（なければ）
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  created_at timestamp DEFAULT now() NOT NULL
);

-- ダミーデータ10件を一気に挿入
INSERT INTO users (name, email)
SELECT
  'DummyUser' || gs::text,
  'dummy' || gs::text || '@example.com'
FROM generate_series(1,10) AS gs;
