ALTER TABLE usuarios
ADD COLUMN imagen_usuario VARCHAR(255);

ALTER TABLE usuarios MODIFY COLUMN role ENUM('Estudiante', 'Maestro', 'Empleador', 'Empresa', 'Egresado') NOT NULL;
ALTER TABLE publicaciones 
ADD COLUMN me_gusta INT DEFAULT 0, 
ADD COLUMN disgusta INT DEFAULT 0;