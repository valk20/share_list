CREATE USER IF NOT EXISTS 'grafana_reader'@'%' 
IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD'
WITH 
    MAX_USER_CONNECTIONS 10       -- Limit concurrent connections from Grafana
    MAX_QUERIES_PER_HOUR 10000;   -- Optional: prevent runaway polling

-- 2. Grant SELECT on non-sensitive tables
GRANT SELECT ON listshare.lists TO 'grafana_reader'@'%';
GRANT SELECT ON listshare.list_items TO 'grafana_reader'@'%';
GRANT SELECT ON listshare.list_likes TO 'grafana_reader'@'%';
GRANT SELECT ON listshare.list_comments TO 'grafana_reader'@'%';

-- 3. Grant column-level SELECT on `users` (hides `password_hash` and `email` if desired)
GRANT SELECT (id, username, created_at) ON listshare.users TO 'grafana_reader'@'%';

FLUSH PRIVILEGES;