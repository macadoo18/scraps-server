BEGIN;

TRUNCATE
  users,
  recipes,
  meal_plan
  RESTART IDENTITY CASCADE;

INSERT INTO users (nickname, username, email, password)
  VALUES
    ('testnick', 'testuser1', 'test@email.com', '$2a$08$DXJbN/JJ01mkRFqNdM6pRehc6mkwadqWkhhi5I9urNyQe/0Yf/nMS'), -- Password87
    ('nicknametest', 'userman2', 'testytest@email.com', '$2a$08$f8B/GDNgNo14CU6MqJoh/uOPwpXns8WlyI0Qnxo4EHAcHdASOvkWa'), -- Pwordpass78
    ('nickytest', 'testyman3', 'testicles@balls.com', '$2a$08$UYb3tMhkNRuk71aRKLfouuLvufbw24aqG6DjPwEXXcffvk/DsdzdK'); -- Goodnsecret007

INSERT INTO recipes (user_id, name, category, type)
  VALUES  
    (1, 'Stromboli', 'italian', 'dinner'),
    (2, 'Lasagna', '', 'snack'),
    (3, 'Chicken pesto', 'meat', 'dinner'),
    (3, 'turkey sandwich', '', 'lunch');

INSERT INTO meal_plan (recipe_id, user_id, meal_type, day_of_week)
  VALUES
    (3, 3, 'breakfast', 'monday'),
    (1, 1, 'lunch', 'tuesday'),
    (4, 3, 'dinner', 'wednesday'),
    (4, 3, 'snack', 'thursday'),
    (1, 1, 'lunch', 'saturday'),
    (2, 2, 'snack', 'saturday');

COMMIT;