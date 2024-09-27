-- Eliminar la columna role existente
ALTER TABLE usuarios DROP COLUMN role;

-- Crear la nueva columna role con el ENUM deseado
ALTER TABLE usuarios ADD COLUMN role ENUM('Estudiantes', 'Docentes', 'Reclutadores', 'Egresados') NOT NULL;

-- Modificar la tabla empleos
ALTER TABLE empleos
ADD COLUMN id_usuario INT,
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id);
