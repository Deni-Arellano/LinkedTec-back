--Es para meterse al master y luego corren todo el script
USE MYSQL;

--Nuevos 
CREATE USER 'Estudiante'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'Docente'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'Reclutadores'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'Administrador'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'Egresado'@'localhost' IDENTIFIED BY '1234';



--creacion de roles 
CREATE ROLE 'EstudianteRol';
CREATE ROLE 'DocenteRol';
CREATE ROLE 'ReclutadoresRol';
create role 'EgresadosRol';
CREATE ROLE 'AdministradorRol';


--Permisos rol estudiante
GRANT insert,Delete,select ON linked_tec.comentarios TO 'EstudianteRoll';
GRANT insert,Delete,select,update ON linked_tec.comentarios TO 'EstudianteRoll';
GRANT insert,Delete,select,update ON linked_tec.estudiantes TO 'EstudianteRoll';
GRANT insert,Delete,select,update ON linked_tec.usuarios TO 'EstudianteRoll';
GRANT insert,Delete,select,update ON linked_tec.reportes TO 'EstudianteRoll';

--perimos Rol Docentes
GRANT insert,Delete,select ON linked_tec.comentarios TO 'DocenteRol';
GRANT insert,Delete,select, update ON linked_tec.evento TO 'DocenteRol';
GRANT insert,Delete,select, update ON linked_tec.noticias TO 'DocenteRol';
GRANT insert,Delete,select, update ON linked_tec.publicaciones TO 'DocenteRol';
GRANT insert,Delete,select, update ON linked_tec.docentes TO 'DocenteRol';
GRANT insert,Delete,select ON linked_tec.reportes TO 'DocenteRol';
GRANT Delete,select, update ON linked_tec.usuarios TO 'DocenteRol';

--permisos Rol Egresados
GRANT insert,Delete,select ON linked_tec.comentarios TO 'EgresadosRol';
GRANT insert,Delete,select, update ON linked_tec.publicaciones TO 'EgresadosRol';
GRANT insert,Delete,select, update ON linked_tec.egresados TO 'EgresadosRol';
GRANT Delete,select, update ON linked_tec.usuarios TO 'EgresadosRol';

--permisos Rol Reclutadores 
GRANT insert,Delete,select ON linked_tec.comentarios TO 'ReclutadoresRol';
GRANT insert,Delete,select, update ON linked_tec.evento TO 'ReclutadoresRol';
GRANT insert,Delete,select, update ON linked_tec.empleos TO 'ReclutadoresRol';
GRANT insert,Delete,select, update ON linked_tec.noticias TO 'ReclutadoresRol';
GRANT insert,Delete,select, update ON linked_tec.reclutadores TO 'ReclutadoresRol';
GRANT insert,Delete,select, update ON linked_tec.reportes TO 'ReclutadoresRol';
GRANT Delete,select, update ON linked_tec.usuarios TO 'ReclutadoresRol';

--permisos de Admin 
GRANT Delete,select ON linked_tec.comentarios TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.evento TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.empleos TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.noticias TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.publicaciones TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.docentes TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.estudiantes TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.reclutadores TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.reportes TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.egresados TO 'AdministradorRol';
GRANT Delete,select, update ON linked_tec.usuarios TO 'AdministradorRol';


--Asignar rol a los usarios 
GRANT 'EstudianteRoll' TO 'Estudiante'@'localhost';
GRANT 'DocenteRol' TO 'Docente'@'localhost';
GRANT 'EgresadosRol' TO 'Egresado'@'localhost';
GRANT 'ReclutadoresRol' TO 'Reclutadores'@'localhost';
GRANT 'AdministradorRol' TO 'Administrador'@'localhost';


--Actvar el rol 
SET DEFAULT ROLE 'EstudianteRoll' TO 'Estudiante'@'localhost';
SET DEFAULT ROLE 'DocenteRol' TO 'Docente'@'localhost';
SET DEFAULT ROLE 'EgresadosRol' TO 'Egresado'@'localhost';
SET DEFAULT ROLE 'ReclutadoresRol' TO 'Reclutadores'@'localhost';
SET DEFAULT ROLE 'AdministradorRol' TO 'Administrador'@'localhost';




--darle para actualizar los privilegios darlo hasta el utlimo y por si solo 
FLUSH PRIVILEGES;


