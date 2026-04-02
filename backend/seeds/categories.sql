-- System default income categories (user_id IS NULL means available to all users)
INSERT INTO categories (name, type) VALUES
  ('Sales',           'income'),
  ('Service Revenue', 'income'),
  ('Consulting',      'income'),
  ('Investment',      'income'),
  ('Other Income',    'income')
ON CONFLICT DO NOTHING;

-- System default expense categories
INSERT INTO categories (name, type) VALUES
  ('Rent',            'expense'),
  ('Utilities',       'expense'),
  ('Marketing',       'expense'),
  ('Supplies',        'expense'),
  ('Software',        'expense'),
  ('Travel',          'expense'),
  ('Meals',           'expense'),
  ('Professional Fees','expense'),
  ('Insurance',       'expense'),
  ('Other Expense',   'expense')
ON CONFLICT DO NOTHING;
