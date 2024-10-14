CREATE TABLE reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,           
    id_usuario INT NOT NULL,                             
	tipo_reporte ENUM('acoso', 'amenaza', 'discriminación', 'difamación', 'ofensa', 'suplantación de identidad', 'fraude', 'otros') NOT NULL, -- Tipo de reporte (se puede ajustar según el caso)
	categoria_reporte ENUM('perfil', 'publicaciones', 'noticias', 'empleos', 'foros', 'eventos', 'otros') NOT NULL, 
    descripcion TEXT NOT NULL,                           
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    id_elemento_reportado INT,                          
    titulo_reporte VARCHAR(255) NOT NULL,                
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)     
);


CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha DATETIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    descripcion TEXT,
    enlace VARCHAR(255),
    imagen VARCHAR(255),
    tipo_evento ENUM('taller', 'seminario', 'evento general') NOT NULL
);
CREATE TABLE confirmacion_asistencia (
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    PRIMARY KEY (id_usuario, id_evento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id), 
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) 
);