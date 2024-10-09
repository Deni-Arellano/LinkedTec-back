CREATE TABLE noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,       
    titulo_noticia  VARCHAR(255) NOT NULL,                    
    descripcion TEXT,         
    imagen_noticia  VARCHAR(255),                             
    enlace_noticia  VARCHAR(255),                            
    fecha_noticia DATETIME DEFAULT CURRENT_TIMESTAMP,  
    categoria_noticia  ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE') NOT NULL,  
    id_usuario INT,                                  
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
