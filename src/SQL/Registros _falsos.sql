INSERT INTO usuarios (id, nombre, apellido_paterno, apellido_materno, correo, contraseña, fecha_nacimiento, telefono, sexo, biografia, imagen_usuario) VALUES
(1, 'Juan', 'Pérez', 'García', 'juan.perez@gmail.com', '123456', '1990-05-10', '5551234567', 'Masculino', 'Ingeniero con experiencia en software', 'imagen1.jpg'),
(2, 'Ana', 'López', 'Martínez', 'ana.lopez@gmail.com', 'abcdef', '1985-09-12', '5559876543', 'Femenino', 'Profesora de matemáticas con doctorado', 'imagen2.jpg'),
(3, 'Carlos', 'Sánchez', 'Hernández', 'carlos.sanchez@gmail.com', 'contraseña123', '1995-07-24', '5557654321', 'Masculino', 'Egresado de ingeniería en sistemas', 'imagen3.jpg'),
(4, 'María', 'Fernández', 'Díaz', 'maria.fernandez@gmail.com', 'qwerty', '1993-02-15', '5552345678', 'Femenino', 'Empleadora en una empresa de tecnología', 'imagen4.jpg'),
(5, 'Roberto', 'Torres', 'Núñez', 'roberto.torres@gmail.com', 'pass456', '1991-04-25', '5553456789', 'Masculino', 'Estudiante de ingeniería industrial', 'imagen5.jpg'),
(6, 'Laura', 'González', 'Morales', 'laura.gonzalez@gmail.com', 'password789', '1988-07-18', '5554567890', 'Femenino', 'Docente en ingeniería de sistemas', 'imagen6.jpg'),
(7, 'Daniel', 'Ramírez', 'Hernández', 'daniel.ramirez@gmail.com', '123qwe', '1996-10-30', '5555678901', 'Masculino', 'Egresado de ingeniería eléctrica', 'imagen7.jpg'),
(8, 'Mónica', 'Castillo', 'Martínez', 'monica.castillo@gmail.com', 'mypass', '1992-12-01', '5556789012', 'Femenino', 'Directora de una empresa comercial', 'imagen8.jpg'),
(9, 'Pablo', 'Martínez', 'Vega', 'pablo.martinez@gmail.com', 'pass1234', '1987-11-21', '5557890123', 'Masculino', 'Profesor de inteligencia artificial', 'imagen9.jpg'),
(10, 'Lucía', 'Ortiz', 'Pérez', 'lucia.ortiz@gmail.com', 'contra123', '1990-06-15', '5558901234', 'Femenino', 'Estudiante de ingeniería de software', 'imagen10.jpg'),
(11, 'Fernando', 'Flores', 'Mendoza', 'fernando.flores@gmail.com', 'pass7890', '1994-01-10', '5559012345', 'Masculino', 'Egresado de ingeniería civil', 'imagen11.jpg'),
(12, 'Patricia', 'Hernández', 'López', 'patricia.hernandez@gmail.com', 'abc1234', '1985-08-05', '5550123456', 'Femenino', 'Maestra en el área de matemáticas', 'imagen12.jpg'),
(13, 'Ricardo', 'Cruz', 'Santos', 'ricardo.cruz@gmail.com', '987654', '1997-03-22', '5551234567', 'Masculino', 'Egresado de ingeniería mecánica', 'imagen13.jpg'),
(14, 'Sofía', 'Moreno', 'Gómez', 'sofia.moreno@gmail.com', 'mypassword', '1993-09-17', '5552345678', 'Femenino', 'Docente en ingeniería industrial', 'imagen14.jpg'),
(15, 'Antonio', 'Jiménez', 'Rivas', 'antonio.jimenez@gmail.com', 'qaz123', '1991-05-06', '5553456789', 'Masculino', 'Empleador en una empresa manufacturera', 'imagen15.jpg'),
(16, 'Gabriela', 'Navarro', 'Salas', 'gabriela.navarro@gmail.com', 'passqwe', '1998-07-30', '5554567890', 'Femenino', 'Estudiante de contaduría pública', 'imagen16.jpg'),
(17, 'José', 'Vargas', 'Méndez', 'jose.vargas@gmail.com', 'pass567', '1989-03-15', '5555678901', 'Masculino', 'Profesor en ingeniería química', 'imagen17.jpg'),
(18, 'Clara', 'Reyes', 'Ortiz', 'clara.reyes@gmail.com', 'passabc', '1992-12-12', '5556789012', 'Femenino', 'Egresada de ingeniería ambiental', 'imagen18.jpg'),
(19, 'Eduardo', 'Pineda', 'Rojas', 'eduardo.pineda@gmail.com', '123xyz', '1990-10-25', '5557890123', 'Masculino', 'Docente en ingeniería civil', 'imagen19.jpg'),
(20, 'Elena', 'Soto', 'Guerrero', 'elena.soto@gmail.com', 'zxcv123', '1995-09-09', '5558901234', 'Femenino', 'Estudiante de ingeniería en alimentos', 'imagen20.jpg'),
(21, 'Alberto', 'Medina', 'Fernández', 'alberto.medina@gmail.com', 'pass678', '1987-07-05', '5559012345', 'Masculino', 'Egresado de ingeniería en software', 'imagen21.jpg'),
(22, 'Victoria', 'Cano', 'Álvarez', 'victoria.cano@gmail.com', 'pass890', '1993-04-13', '5550123456', 'Femenino', 'Maestra en ingeniería en telecomunicaciones', 'imagen22.jpg'),
(23, 'Javier', 'Luna', 'Cervantes', 'javier.luna@gmail.com', 'passasd', '1992-02-17', '5551234567', 'Masculino', 'Empleador en el sector agrícola', 'imagen23.jpg'),
(24, 'Rebeca', 'Gómez', 'Santiago', 'rebeca.gomez@gmail.com', 'passpoi', '1994-08-22', '5552345678', 'Femenino', 'Egresada de ingeniería bioquímica', 'imagen24.jpg'),
(25, 'Luis', 'Ortega', 'Ramírez', 'luis.ortega@gmail.com', 'zxczxc', '1996-01-28', '5553456789', 'Masculino', 'Estudiante de ingeniería mecatrónica', 'imagen25.jpg');



UPDATE usuarios SET role = 'Estudiantes' WHERE id IN (5, 10, 16, 20, 25);
UPDATE usuarios SET role = 'Docentes' WHERE id IN (2, 6, 9, 12, 14, 17, 19, 22);
UPDATE usuarios SET role = 'Egresados' WHERE id IN (3, 7, 11, 13, 18, 21, 24);
UPDATE usuarios SET role = 'Reclutadores' WHERE id IN (4, 8, 15, 23);



INSERT INTO estudiantes (id, no_control, carrera, semestre) VALUES
(5, '123456789', 'ISC', 'V'),
(10, '987654321', 'IA', 'IV'),
(16, '112233445', 'CP', 'VII'),
(20, '223344556', 'IE', 'II'),
(25, '334455667', 'II', 'III');



INSERT INTO docentes (id, ultimo_nivel_estudios, numero_empleado, academia) VALUES
(2, 'Doctorado', 'EMP001', 'ISC'),
(6, 'Maestría', 'EMP002', 'IE'),
(9, 'Licenciatura', 'EMP003', 'II'),
(12, 'Maestría', 'EMP004', 'IA'),
(14, 'Doctorado', 'EMP005', 'CP'),
(17, 'Licenciatura', 'EMP006', 'IGE'),
(19, 'Doctorado', 'EMP007', 'ISC'),
(22, 'Maestría', 'EMP008', 'ISC');


INSERT INTO reclutadores (id, nombre_empresa, sede, giro) VALUES
(4, 'Tech Solutions', 'Ciudad de México', 'Comercial'),
(8, 'Software Global', 'Monterrey', 'Servicio'),
(15, 'Industrias Avanzadas', 'Guadalajara', 'Manufacturera'),
(23, 'AgroMex', 'Morelia', 'Agricultura');


INSERT INTO egresados (id, carrera, año_graduacion, puesto) VALUES
(3, 'ISC', 2020, 'Ingeniero de software'),
(7, 'IE', 2018, 'Supervisor de planta'),
(11, 'IA', 2019, 'Especialista en automatización'),
(13, 'CP', 2021, 'Contador público'),
(18, 'II', 2022, 'Consultor en logística'),
(21, 'IGE', 2020, 'Gerente de proyectos'),
(24, 'ISC', 2017, 'Investigadora en biotecnología');



INSERT INTO publicaciones (id_publicacion, descripcion, imagen, fecha, id_usuario) VALUES
(1, 'Nuevo proyecto de investigación', 'proyecto1.jpg', '2024-10-10 14:30:00', 6),
(2, 'Conferencia sobre inteligencia artificial', 'conferencia.jpg', '2024-10-12 09:00:00', 9),
(3, 'Oferta de empleo en Tech Solutions', 'empleo.jpg', '2024-10-15 08:45:00', 4),
(4, 'Taller de desarrollo web', 'taller.jpg', '2024-10-18 13:00:00', 14),
(5, 'Nueva tecnología en automatización', 'tecnologia.jpg', '2024-10-20 11:15:00', 11);



INSERT INTO empleos (id_empleo, titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles, id_usuario, fecha_creacion) VALUES
(1, 'Desarrollador Full Stack', 'Tech Solutions', 35000.00, 'Se busca desarrollador Full Stack con experiencia en React y Node.js', 'Ciudad de México', 'Intermedio', 4, '2024-10-05 10:00:00'),
(2, 'Ingeniero de Automatización', 'Industrias Avanzadas', 45000.00, 'Responsable de automatización de procesos industriales', 'Guadalajara', 'Avanzado', 15, '2024-10-07 14:30:00'),
(3, 'Analista Financiero', 'Software Global', 40000.00, 'Encargado de análisis de riesgos financieros', 'Monterrey', 'Básico', 8, '2024-10-09 12:00:00'),
(4, 'Gerente de Planta', 'AgroMex', 50000.00, 'Gerente encargado de las operaciones en planta', 'Morelia', 'No aplica', 23, '2024-10-11 16:45:00');



INSERT INTO evento (id_evento, titulo, fecha, lugar, descripcion, enlace, imagen, tipo_evento, id_usuario) VALUES
(1, 'Taller de programación avanzada', '2024-10-25 09:00:00', 'Ciudad de México', 'Un taller para mejorar tus habilidades en programación avanzada', 'www.evento.com', 'taller.jpg', 'taller', 6),
(2, 'Seminario sobre tecnología emergente', '2024-11-05 14:00:00', 'Guadalajara', 'Explora las últimas tecnologías emergentes en el sector tecnológico', 'www.evento.com', 'seminario.jpg', 'seminario', 9),
(3, 'Evento de networking para egresados', '2024-11-12 17:00:00', 'Monterrey', 'Conéctate con otros egresados y empleadores', 'www.evento.com', 'networking.jpg', 'evento general', 11);


INSERT INTO postulacion (id_postulacion, id_usuario, id_empleo, descripcion_personal, cv, id_estado) VALUES
(1, 5, 1, 'Me interesa el puesto de Desarrollador Full Stack por mis habilidades en React y Node.js', 1, 1),
(2, 7, 2, 'Tengo experiencia en automatización de procesos industriales y busco contribuir en su equipo', 2, 1),
(3, 13, 3, 'Busco aplicar mis conocimientos financieros en su empresa', 3, 1),
(4, 16, 1, 'Estoy interesada en el puesto de Desarrollador Full Stack ya que me apasiona la tecnología', 4, 2),
(5, 21, 4, 'Tengo experiencia en operaciones de planta y puedo aportar mejoras significativas', 5, 3);


INSERT INTO subidas_cloudinary (id, id_recurso, id_publico, formato, tipo_recurso, fecha_creacion, url_segura, carpeta, nombre_original, tipo_subida) VALUES
(1, 'recurso1', 'publico1', 'jpg', 'imagen', NOW(), 'http://example.com/image1.jpg', 'carpeta1', 'imagen1.jpg', 'imagen'),
(2, 'recurso2', 'publico2', 'pdf', 'archivo', NOW(), 'http://example.com/file1.pdf', 'carpeta2', 'archivo1.pdf', 'archivo'),
(3, 'recurso3', 'publico3', 'jpg', 'imagen', NOW(), 'http://example.com/image2.jpg', 'carpeta1', 'imagen2.jpg', 'imagen'),
(4, 'recurso4', 'publico4', 'pdf', 'archivo', NOW(), 'http://example.com/file2.pdf', 'carpeta2', 'archivo2.pdf', 'archivo'),
(5, 'recurso5', 'publico5', 'jpg', 'imagen', NOW(), 'http://example.com/image3.jpg', 'carpeta1', 'imagen3.jpg', 'imagen');
