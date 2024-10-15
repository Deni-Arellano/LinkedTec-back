DROP TABLE IF EXISTS confirmacion_asistencia;

CREATE TABLE confirmacion_asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Nueva columna id como clave primaria
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento)
);

