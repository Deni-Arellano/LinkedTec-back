CREATE TABLE empleos (
  id_empleo INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255),
  empresa VARCHAR(255),
  salario DECIMAL(10, 2),
  descripcion TEXT,
  ubicacion VARCHAR(255),
  nivel_de_ingles ENUM('Avanzado', 'Intermedio', 'Básico', 'No aplica')
);

