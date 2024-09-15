'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TABLE Usuarios (
        id_usuario INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(255),
        apellido_paterno VARCHAR(255),
        apellido_materno VARCHAR(255),
        correo VARCHAR(255),
        contrasena VARCHAR(255),
        tipo_usuario ENUM('egresado', 'reclutador', 'estudiante', 'docente')
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Egresados (
        id_usuario INT PRIMARY KEY,
        telefono VARCHAR(20),
        sexo VARCHAR(10),
        fecha_nacimiento DATE,
        biografia TEXT,
        carrera VARCHAR(255),
        ano_graduacion YEAR,
        puesto VARCHAR(255),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Reclutadores (
        id_usuario INT PRIMARY KEY,
        telefono VARCHAR(20),
        sexo VARCHAR(10),
        nombre_empresa VARCHAR(255),
        fecha_fundacion DATE,
        sector_comercial VARCHAR(255),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Estudiantes (
        id_usuario INT PRIMARY KEY,
        no_control VARCHAR(20),
        biografia TEXT,
        telefono VARCHAR(20),
        carrera VARCHAR(255),
        semestre VARCHAR(50),
        sexo VARCHAR(10),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Docentes (
        id_usuario INT PRIMARY KEY,
        fecha_nacimiento DATE,
        biografia TEXT,
        telefono VARCHAR(20),
        ultimo_nivel_estudios VARCHAR(255),
        numero_empleado VARCHAR(20),
        rh VARCHAR(10),
        academia VARCHAR(255),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Publicaciones (
        id_publicacion INT PRIMARY KEY AUTO_INCREMENT,
        texto VARCHAR(255),
        imagen VARCHAR(255),
        fecha DATE,
        id_usuario INT,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Comentarios (
        id_comentario INT PRIMARY KEY AUTO_INCREMENT,
        texto VARCHAR(255),
        fecha DATE,
        id_usuario INT,
        id_publicacion INT,
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
        FOREIGN KEY (id_publicacion) REFERENCES Publicaciones(id_publicacion)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE Empleos (
        id_empleo INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(255),
        empresa VARCHAR(255),
        salario DECIMAL(10, 2),
        descripcion TEXT,
        ubicacion VARCHAR(255),
        nivel_de_ingles VARCHAR(50)
      );
    `);

    await queryInterface.sequelize.query(`
      CREATE TABLE PublicacionEmpleos (
        id_publicacion_empleo INT PRIMARY KEY AUTO_INCREMENT,
        fecha_publicacion DATE,
        id_empleo INT,
        id_usuario INT,
        FOREIGN KEY (id_empleo) REFERENCES Empleos(id_empleo),
        FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS PublicacionEmpleos;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Empleos;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Comentarios;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Publicaciones;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Docentes;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Estudiantes;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Reclutadores;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Egresados;
    `);

    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS Usuarios;
    `);
  }
};
