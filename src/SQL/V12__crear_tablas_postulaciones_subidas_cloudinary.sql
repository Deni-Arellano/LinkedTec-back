CREATE TABLE postulacion (
    id_postulacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_empleo INT NOT NULL,
    descripcion_personal VARCHAR(500), 
    cv VARCHAR(255) ,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_empleo) REFERENCES evento(id_evento)
);


CREATE TABLE subidas_cloudinary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_recurso VARCHAR(255) NOT NULL,        -- Identificador único del recurso en Cloudinary (asset_id)
    id_publico VARCHAR(255) NOT NULL,        -- ID público del recurso en Cloudinary (public_id)
    formato VARCHAR(50),                     -- Formato del archivo (ej. jpg, png, pdf)
    tipo_recurso VARCHAR(50),                -- Tipo de recurso (imagen, archivo)
    fecha_creacion DATETIME,                 -- Fecha y hora de creación del archivo (created_at)
    url_segura VARCHAR(500),                 -- URL segura del archivo en Cloudinary (secure_url)
    carpeta VARCHAR(255),                    -- Carpeta en Cloudinary donde se almacenó el archivo (folder)
    nombre_original VARCHAR(255),            -- Nombre original del archivo antes de ser subido
    tipo_subida ENUM('imagen', 'archivo')    -- Tipo de subida (imagen o archivo)
);