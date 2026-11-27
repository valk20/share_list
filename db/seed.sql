-- =============================================================================
-- ShareList Database Seed Script
-- =============================================================================
-- Populates all tables with realistic mock data for testing REST API routes:
--   - 6 Users (Users 1-3 are primary test accounts, all passwords: password123)
--     * Note: 6 users are included because 10 lists * 3 users = max 30 unique likes
--       due to the UNIQUE (list_id, user_id) constraint. 6 users enable 50 unique likes.
--   - 10 Lists (8 Public, 2 Private, 2 Forked across various categories)
--   - 42 List Items (Mix of completed and pending checklist tasks)
--   - 50 List Likes (Exactly 50 unique likes distributed across lists)
--   - 15 List Comments (Realistic feedback and discussions)
-- =============================================================================

USE listshare;

-- Disable foreign key checks for clean truncation / re-seeding
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE list_comments;
TRUNCATE TABLE list_likes;
TRUNCATE TABLE list_items;
TRUNCATE TABLE lists;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------------------------
-- All accounts use 'password123' as password_hash for easy testing
-- Primary test accounts: johndoe (ID 1), janedoe (ID 2), bobsmith (ID 3)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, created_at) VALUES
(1, 'johndoe', 'john@example.com', 'password123', '2026-10-01 10:00:00'),
(2, 'janedoe', 'jane@example.com', 'password123', '2026-10-01 10:30:00'),
(3, 'bobsmith', 'bob@example.com', 'password123', '2026-10-02 11:00:00'),
(4, 'alice_wonder', 'alice@example.com', 'password123', '2026-10-02 11:30:00'),
(5, 'charlie_dev', 'charlie@example.com', 'password123', '2026-10-03 12:00:00'),
(6, 'david_traveler', 'david@example.com', 'password123', '2026-10-03 12:30:00');

-- -----------------------------------------------------------------------------
-- 2. LISTS
-- -----------------------------------------------------------------------------
-- 10 Lists across diverse categories:
--   - Public lists: 1, 2, 4, 5, 6, 8, 9, 10
--   - Private lists: 3, 7
--   - Forked lists: 6 (forked from 2), 10 (forked from 1)
-- -----------------------------------------------------------------------------
INSERT INTO lists (id, owner_id, title, category, is_public, forked_from_id, created_at) VALUES
(1, 1, 'Top 10 Sci-Fi Books to Read', 'books', TRUE, NULL, '2026-10-05 09:00:00'),
(2, 1, 'Summer Road Trip Essentials', 'travel', TRUE, NULL, '2026-10-05 14:00:00'),
(3, 1, 'Secret Work Projects & Roadmap', 'productivity', FALSE, NULL, '2026-10-06 08:30:00'),
(4, 2, 'Must-Watch Psychological Thrillers', 'movies', TRUE, NULL, '2026-10-06 17:15:00'),
(5, 2, 'Weekly Clean Eating Grocery List', 'shopping', TRUE, NULL, '2026-10-07 10:20:00'),
(6, 2, 'Summer Road Trip Essentials (Jane Edition)', 'travel', TRUE, 2, '2026-10-07 16:45:00'),
(7, 2, 'Personal Financial Goals 2026', 'productivity', FALSE, NULL, '2026-10-08 09:10:00'),
(8, 3, 'Ultimate Full-Stack Dev Setup', 'tech', TRUE, NULL, '2026-10-08 13:00:00'),
(9, 3, 'Beginner Morning Workout Routine', 'fitness', TRUE, NULL, '2026-10-09 07:00:00'),
(10, 3, 'Sci-Fi Masterpieces (Curated Community Edition)', 'books', TRUE, 1, '2026-10-09 18:30:00');

-- -----------------------------------------------------------------------------
-- 3. LIST ITEMS
-- -----------------------------------------------------------------------------
-- 42 Items distributed across all 10 lists with varied completion statuses
-- -----------------------------------------------------------------------------
INSERT INTO list_items (id, list_id, title, is_completed, created_at) VALUES
-- Items for List 1: Top 10 Sci-Fi Books
(1, 1, 'Dune by Frank Herbert', TRUE, '2026-10-05 09:05:00'),
(2, 1, 'Hyperion by Dan Simmons', TRUE, '2026-10-05 09:10:00'),
(3, 1, 'Neuromancer by William Gibson', FALSE, '2026-10-05 09:15:00'),
(4, 1, 'Foundation by Isaac Asimov', FALSE, '2026-10-05 09:20:00'),

-- Items for List 2: Summer Road Trip Essentials
(5, 2, 'Sunglasses and high-SPF sunscreen', TRUE, '2026-10-05 14:05:00'),
(6, 2, 'Compact first aid kit', TRUE, '2026-10-05 14:10:00'),
(7, 2, 'Download offline regional maps', FALSE, '2026-10-05 14:15:00'),
(8, 2, 'Tire pressure gauge & jumper cables', FALSE, '2026-10-05 14:20:00'),
(9, 2, 'Insulated reusable water bottles', TRUE, '2026-10-05 14:25:00'),

-- Items for List 3: Secret Work Projects (Private)
(10, 3, 'Refactor backend database connection pooling', TRUE, '2026-10-06 08:35:00'),
(11, 3, 'Implement Redis caching for hot feeds', FALSE, '2026-10-06 08:40:00'),
(12, 3, 'Design real-time WebSocket notifications', FALSE, '2026-10-06 08:45:00'),

-- Items for List 4: Must-Watch Thrillers
(13, 4, 'Shutter Island (2010)', TRUE, '2026-10-06 17:20:00'),
(14, 4, 'Se7en (1995)', TRUE, '2026-10-06 17:25:00'),
(15, 4, 'Prisoners (2013)', FALSE, '2026-10-06 17:30:00'),
(16, 4, 'Gone Girl (2014)', FALSE, '2026-10-06 17:35:00'),

-- Items for List 5: Weekly Clean Eating Grocery List
(17, 5, 'Organic rolled oats & chia seeds', TRUE, '2026-10-07 10:25:00'),
(18, 5, 'Plain unsweetened Greek yogurt', TRUE, '2026-10-07 10:30:00'),
(19, 5, 'Fresh blueberries and organic bananas', FALSE, '2026-10-07 10:35:00'),
(20, 5, 'Unsweetened almond milk', FALSE, '2026-10-07 10:40:00'),
(21, 5, 'Skinless chicken breast fillets', TRUE, '2026-10-07 10:45:00'),

-- Items for List 6: Road Trip Essentials (Jane Edition, Forked)
(22, 6, 'Sunglasses and high-SPF sunscreen', TRUE, '2026-10-07 16:50:00'),
(23, 6, 'Compact first aid kit', TRUE, '2026-10-07 16:55:00'),
(24, 6, 'Spotify offline road trip playlist', TRUE, '2026-10-07 17:00:00'),
(25, 6, 'Portable fast-charge power bank (20,000mAh)', FALSE, '2026-10-07 17:05:00'),
(26, 6, 'Healthy roasted nuts & protein bars', FALSE, '2026-10-07 17:10:00'),

-- Items for List 7: Personal Financial Goals 2026 (Private)
(27, 7, 'Build 6-month living expenses emergency fund', TRUE, '2026-10-08 09:15:00'),
(28, 7, 'Max out annual retirement contributions', FALSE, '2026-10-08 09:20:00'),
(29, 7, 'Audit recurring monthly subscription services', TRUE, '2026-10-08 09:25:00'),

-- Items for List 8: Ultimate Full-Stack Dev Setup
(30, 8, 'VS Code configured with Vim keybindings', TRUE, '2026-10-08 13:05:00'),
(31, 8, 'Docker Desktop & Docker Compose v2', TRUE, '2026-10-08 13:10:00'),
(32, 8, 'DBeaver Community Edition for database GUI', TRUE, '2026-10-08 13:15:00'),
(33, 8, 'Postman / Bruno for REST API validation', FALSE, '2026-10-08 13:20:00'),
(34, 8, 'Zsh terminal with Powerlevel10k theme', FALSE, '2026-10-08 13:25:00'),

-- Items for List 9: Beginner Morning Workout Routine
(35, 9, '5-minute full body dynamic stretching', TRUE, '2026-10-09 07:05:00'),
(36, 9, '20 chest push-ups', FALSE, '2026-10-09 07:10:00'),
(37, 9, '30 bodyweight air squats', FALSE, '2026-10-09 07:15:00'),
(38, 9, '60-second core plank hold', FALSE, '2026-10-09 07:20:00'),

-- Items for List 10: Sci-Fi Masterpieces (Forked)
(39, 10, 'Dune by Frank Herbert', TRUE, '2026-10-09 18:35:00'),
(40, 10, 'The Three-Body Problem by Liu Cixin', FALSE, '2026-10-09 18:40:00'),
(41, 10, 'Project Hail Mary by Andy Weir', FALSE, '2026-10-09 18:45:00'),
(42, 10, 'Blindsight by Peter Watts', FALSE, '2026-10-09 18:50:00');

-- -----------------------------------------------------------------------------
-- 4. LIST LIKES
-- -----------------------------------------------------------------------------
-- Exactly 50 unique likes adhering to UNIQUE (list_id, user_id)
-- -----------------------------------------------------------------------------
INSERT INTO list_likes (id, list_id, user_id, created_at) VALUES
-- Likes for List 1 (6 likes)
(1, 1, 1, '2026-10-05 10:00:00'),
(2, 1, 2, '2026-10-05 10:15:00'),
(3, 1, 3, '2026-10-05 11:00:00'),
(4, 1, 4, '2026-10-05 12:30:00'),
(5, 1, 5, '2026-10-05 14:00:00'),
(6, 1, 6, '2026-10-05 15:45:00'),

-- Likes for List 2 (6 likes)
(7, 2, 1, '2026-10-05 16:00:00'),
(8, 2, 2, '2026-10-05 16:30:00'),
(9, 2, 3, '2026-10-05 17:00:00'),
(10, 2, 4, '2026-10-05 18:15:00'),
(11, 2, 5, '2026-10-05 19:00:00'),
(12, 2, 6, '2026-10-05 20:30:00'),

-- Likes for List 3 (Private list, 1 like by owner)
(13, 3, 1, '2026-10-06 09:00:00'),

-- Likes for List 4 (6 likes)
(14, 4, 1, '2026-10-06 18:00:00'),
(15, 4, 2, '2026-10-06 18:30:00'),
(16, 4, 3, '2026-10-06 19:15:00'),
(17, 4, 4, '2026-10-06 20:00:00'),
(18, 4, 5, '2026-10-06 21:00:00'),
(19, 4, 6, '2026-10-06 22:30:00'),

-- Likes for List 5 (6 likes)
(20, 5, 1, '2026-10-07 11:00:00'),
(21, 5, 2, '2026-10-07 11:30:00'),
(22, 5, 3, '2026-10-07 12:00:00'),
(23, 5, 4, '2026-10-07 13:00:00'),
(24, 5, 5, '2026-10-07 14:15:00'),
(25, 5, 6, '2026-10-07 15:00:00'),

-- Likes for List 6 (6 likes)
(26, 6, 1, '2026-10-07 18:00:00'),
(27, 6, 2, '2026-10-07 18:30:00'),
(28, 6, 3, '2026-10-07 19:00:00'),
(29, 6, 4, '2026-10-07 20:00:00'),
(30, 6, 5, '2026-10-07 21:15:00'),
(31, 6, 6, '2026-10-07 22:00:00'),

-- Likes for List 7 (Private list, 1 like by owner)
(32, 7, 2, '2026-10-08 10:00:00'),

-- Likes for List 8 (6 likes)
(33, 8, 1, '2026-10-08 14:00:00'),
(34, 8, 2, '2026-10-08 14:30:00'),
(35, 8, 3, '2026-10-08 15:00:00'),
(36, 8, 4, '2026-10-08 16:00:00'),
(37, 8, 5, '2026-10-08 17:30:00'),
(38, 8, 6, '2026-10-08 18:45:00'),

-- Likes for List 9 (6 likes)
(39, 9, 1, '2026-10-09 08:00:00'),
(40, 9, 2, '2026-10-09 08:30:00'),
(41, 9, 3, '2026-10-09 09:00:00'),
(42, 9, 4, '2026-10-09 10:15:00'),
(43, 9, 5, '2026-10-09 11:30:00'),
(44, 9, 6, '2026-10-09 12:00:00'),

-- Likes for List 10 (6 likes)
(45, 10, 1, '2026-10-09 19:00:00'),
(46, 10, 2, '2026-10-09 19:30:00'),
(47, 10, 3, '2026-10-09 20:00:00'),
(48, 10, 4, '2026-10-09 20:45:00'),
(49, 10, 5, '2026-10-09 21:15:00'),
(50, 10, 6, '2026-10-09 22:00:00');

-- -----------------------------------------------------------------------------
-- 5. LIST COMMENTS
-- -----------------------------------------------------------------------------
-- Exactly 15 realistic comments across different lists and users
-- -----------------------------------------------------------------------------
INSERT INTO list_comments (id, list_id, user_id, content, created_at) VALUES
(1, 1, 2, 'Dune is an absolute masterpiece! Highly recommend reading Messiah right after.', '2026-10-05 10:30:00'),
(2, 1, 3, 'Hyperion\'s structure with the pilgrim tales was mind-blowing.', '2026-10-05 11:15:00'),
(3, 1, 4, 'Don\'t forget to check out Project Hail Mary as well, it fits this list perfectly!', '2026-10-05 13:00:00'),
(4, 2, 3, 'A portable jump starter changed my road trips forever. Must-have addition!', '2026-10-05 17:30:00'),
(5, 2, 5, 'Offline maps are essential, saved me in Utah when cell service dropped completely.', '2026-10-05 19:15:00'),
(6, 4, 1, 'Prisoners had me on the edge of my seat the entire time. Denis Villeneuve is brilliant.', '2026-10-06 18:45:00'),
(7, 4, 6, 'Se7en\'s ending is still one of the most chilling in cinematic history.', '2026-10-06 22:45:00'),
(8, 5, 3, 'Swapping regular yogurt with Greek yogurt was a game changer for morning protein.', '2026-10-07 12:15:00'),
(9, 5, 4, 'Great clean eating list! I usually add chia seeds and spinach too.', '2026-10-07 13:30:00'),
(10, 6, 1, 'Thanks for the shoutout on the fork! Love the power bank recommendation.', '2026-10-07 18:45:00'),
(11, 6, 5, 'Can you share the link to your Spotify road trip playlist?', '2026-10-07 21:30:00'),
(12, 8, 1, 'VS Code with Vim keybindings is unstoppable once you get past the learning curve.', '2026-10-08 14:15:00'),
(13, 8, 4, 'DBeaver is so versatile across Postgres and MySQL, great tool choice.', '2026-10-08 16:30:00'),
(14, 9, 2, 'Starting my morning with this tomorrow! Perfect quick routine before heading to work.', '2026-10-09 08:45:00'),
(15, 10, 6, 'The Three-Body Problem trilogy completely reshaped how I think about sci-fi.', '2026-10-09 20:15:00');

-- -----------------------------------------------------------------------------
-- Verification Check (Count per table)
-- -----------------------------------------------------------------------------
SELECT 'users' AS `table_name`, COUNT(*) AS `row_count` FROM users
UNION ALL
SELECT 'lists', COUNT(*) FROM lists
UNION ALL
SELECT 'list_items', COUNT(*) FROM list_items
UNION ALL
SELECT 'list_likes', COUNT(*) FROM list_likes
UNION ALL
SELECT 'list_comments', COUNT(*) FROM list_comments;
