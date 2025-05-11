-- usersテーブルを作成（なければ）
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- ダミーデータ10件を一気に挿入
INSERT INTO users (name, email, password)
SELECT
  'DummyUser' || gs::text,
  'dummy' || gs::text || '@example.com',
  'password' || gs::text
FROM generate_series(1,10) AS gs;
