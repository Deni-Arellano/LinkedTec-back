ALTER TABLE notificaciones 
MODIFY COLUMN tipo ENUM('empleo', 'noticia', 'postulacion', 'me_gusta', 'seguimiento') NOT NULL;
