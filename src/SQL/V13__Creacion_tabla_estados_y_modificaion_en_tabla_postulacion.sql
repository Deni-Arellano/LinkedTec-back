CREATE TABLE estados (
    id_estado INT PRIMARY KEY,
    estado varchar(50) NOT NULL
);


INSERT INTO estados (id_estado, estado) VALUES 
(1, 'Pendiente'), 
(2, 'No Aceptado'), 
(3, 'Aceptado'), 
(4, 'Cancelada');



ALTER TABLE postulacion 
ADD COLUMN id_estado INT,
ADD CONSTRAINT fk_estado
FOREIGN KEY (id_estado) REFERENCES estados(id_estado);
