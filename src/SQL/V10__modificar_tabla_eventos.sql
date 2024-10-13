ALTER TABLE evento
ADD COLUMN id_usuario INT NOT NULL;

ALTER TABLE evento
ADD CONSTRAINT fk_usuario_evento
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
ON DELETE CASCADE;
