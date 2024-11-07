CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_remitente) REFERENCES usuarios(id),
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id)
);