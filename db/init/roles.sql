INSERT INTO roles (id, name) VALUES
(1, 'Marquesado'),
(2, 'Nido'),
(3, 'Alianza'),
(4, 'Vagabundo')
ON DUPLICATE KEY UPDATE name = VALUES(name);