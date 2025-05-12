-- item_categories seed
INSERT INTO item_categories (code, label) VALUES
  ('cleaning', '{"ja": "清掃用品", "en": "Cleaning"}'),
  ('food', '{"ja": "食品", "en": "Food"}'),
  ('daily', '{"ja": "日用品", "en": "Daily Goods"}');

-- units seed
INSERT INTO units (code, label) VALUES
  ('piece', '{"ja": "個", "en": "Piece"}'),
  ('bottle', '{"ja": "本", "en": "Bottle"}'),
  ('sheet', '{"ja": "枚", "en": "Sheet"}');

-- locations seed
INSERT INTO locations (code, label) VALUES
  ('kitchen', '{"ja": "キッチン", "en": "Kitchen"}'),
  ('bathroom', '{"ja": "浴室", "en": "Bathroom"}'),
  ('living', '{"ja": "リビング", "en": "Living Room"}'); 