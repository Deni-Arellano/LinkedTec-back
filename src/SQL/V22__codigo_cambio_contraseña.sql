ALTER TABLE usuarios
ADD COLUMN codigo_recuperacion VARCHAR(255) NULL,
ADD COLUMN expiracion_codigo DATETIME NULL;