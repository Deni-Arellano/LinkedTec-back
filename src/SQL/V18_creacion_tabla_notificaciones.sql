CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('empleo', 'noticia', 'postulacion_aceptada', 'postulacion_rechazada', 'me_gusta','disgusta', 'reporte_publicacion', 'reporte_noticia') NOT NULL,
    id_referencia_tipo INT NOT NULL,
    mensaje TEXT NOT NULL,
    id_creador INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificaciones_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_notificacion INT NOT NULL,
    id_usuario INT NOT NULL,
    
    FOREIGN KEY (id_notificacion) REFERENCES notificaciones(id_notificacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);
