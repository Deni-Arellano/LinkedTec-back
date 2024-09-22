CREATE DATABASE linked_tec;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255) NOT NULL,
    apellido_materno VARCHAR(255),
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    sexo ENUM('Masculino', 'Femenino', 'Otro'),
    biografia TEXT,
    role ENUM('Estudiante', 'Maestro', 'Empleador', 'Empresa') NOT NULL
);

CREATE TABLE estudiantes (
    id INT PRIMARY KEY,
    no_control VARCHAR(50) UNIQUE NOT NULL,
    carrera ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE') NOT NULL,
    semestre ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX') NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE reclutadores (
    id INT PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    sede VARCHAR(255),
    giro ENUM('Comercial', 'Servicio', 'Manufacturera', 'Agricultura') NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE egresados (
    id INT PRIMARY KEY,
    carrera ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE') NOT NULL,
    año_graduacion YEAR NOT NULL,
    puesto VARCHAR(255),
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE docentes (
    id INT PRIMARY KEY,
    ultimo_nivel_estudios ENUM('Licenciatura', 'Maestría', 'Doctorado') NOT NULL,
    numero_empleado VARCHAR(10) UNIQUE NOT NULL,
    academia ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE') NOT NULL,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
);

