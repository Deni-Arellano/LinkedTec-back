ALTER TABLE reportes
ADD COLUMN estado ENUM('Atendido', 'En espera', 'Pendiente') NOT NULL DEFAULT 'Pendiente';
