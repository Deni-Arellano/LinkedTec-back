ALTER TABLE postulacion 
DROP COLUMN cv;

ALTER TABLE postulacion 
ADD COLUMN cv INT;

ALTER TABLE postulacion 
ADD CONSTRAINT fk_cv 
FOREIGN KEY (cv) REFERENCES subidas_cloudinary(id);
