-- item_categories seed
INSERT INTO item_categories (id, code, label) VALUES
  (1, 'cleaning', '{"ja": "清掃用品", "en": "Cleaning"}'),
  (2, 'food', '{"ja": "食品", "en": "Food"}'),
  (3, 'daily', '{"ja": "日用品", "en": "Daily Goods"}')
  ON CONFLICT (id) DO NOTHING;

-- units seed
INSERT INTO units (id, code, label) VALUES
  (1, 'piece', '{"ja": "個", "en": "Piece"}'),
  (2, 'bottle', '{"ja": "本", "en": "Bottle"}'),
  (3, 'sheet', '{"ja": "枚", "en": "Sheet"}')
  ON CONFLICT (id) DO NOTHING;

-- locations seed
INSERT INTO locations (id, code, label) VALUES
  (1, 'kitchen', '{"ja": "キッチン", "en": "Kitchen"}'),
  (2, 'bathroom', '{"ja": "浴室", "en": "Bathroom"}'),
  (3, 'living', '{"ja": "リビング", "en": "Living Room"}')
  ON CONFLICT (id) DO NOTHING;
  