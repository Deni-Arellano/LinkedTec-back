CREATE TABLE seguimientos (
    id_seguidores INT AUTO_INCREMENT PRIMARY KEY, 
    id_usuario INT NOT NULL,           
    id_perfil_a_seguir INT NOT NULL,   
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_usuario, id_perfil_a_seguir), 
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_perfil_a_seguir FOREIGN KEY (id_perfil_a_seguir) REFERENCES usuarios(id) 
);
