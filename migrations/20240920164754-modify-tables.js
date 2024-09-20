'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verifica si la columna "telefono" existe antes de eliminarla en Estudiantes
    const [resultsEstudiantes] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Estudiantes' AND COLUMN_NAME IN ('telefono', 'sexo');
    `);

    // Si la columna existe, entonces elimínala
    if (resultsEstudiantes.length) {
      await queryInterface.sequelize.query(`
        ALTER TABLE Estudiantes
        MODIFY carrera ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        MODIFY semestre ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'),
        ${resultsEstudiantes.some(col => col.COLUMN_NAME === 'telefono') ? 'DROP COLUMN telefono,' : ''}
        ${resultsEstudiantes.some(col => col.COLUMN_NAME === 'sexo') ? 'DROP COLUMN sexo;' : ''};
      `);
    }

    // Verificación para Reclutadores
    const [resultsReclutadores] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Reclutadores' AND COLUMN_NAME IN ('fecha_fundacion', 'telefono', 'sexo');
    `);

    if (resultsReclutadores.length) {
      await queryInterface.sequelize.query(`
        ALTER TABLE Reclutadores
        ${resultsReclutadores.some(col => col.COLUMN_NAME === 'fecha_fundacion') ? 'DROP COLUMN fecha_fundacion,' : ''}
        ${resultsReclutadores.some(col => col.COLUMN_NAME === 'telefono') ? 'DROP COLUMN telefono,' : ''}
        ${resultsReclutadores.some(col => col.COLUMN_NAME === 'sexo') ? 'DROP COLUMN sexo,' : ''}
        RENAME COLUMN sector_comercial TO giro;
      `);

      await queryInterface.sequelize.query(`
        ALTER TABLE Reclutadores
        MODIFY giro ENUM('Comercial', 'servicio', 'manufacturera', 'agricultura'),
        ADD sede VARCHAR(255);
      `);
    }

    // Verificación para Egresados
    const [resultsEgresados] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Egresados' AND COLUMN_NAME IN ('fecha_nacimiento', 'telefono', 'sexo');
    `);

    if (resultsEgresados.length) {
      await queryInterface.sequelize.query(`
        ALTER TABLE Egresados
        MODIFY carrera ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        MODIFY ano_graduacion YEAR,
        MODIFY puesto VARCHAR(255),
        ${resultsEgresados.some(col => col.COLUMN_NAME === 'fecha_nacimiento') ? 'DROP COLUMN fecha_nacimiento,' : ''}
        ${resultsEgresados.some(col => col.COLUMN_NAME === 'telefono') ? 'DROP COLUMN telefono,' : ''}
        ${resultsEgresados.some(col => col.COLUMN_NAME === 'sexo') ? 'DROP COLUMN sexo;' : ''}
      `);
    }

    // Verificación para Docentes
    const [resultsDocentes] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Docentes' AND COLUMN_NAME IN ('rh', 'fecha_nacimiento', 'telefono');
    `);

    if (resultsDocentes.length) {
      await queryInterface.sequelize.query(`
        ALTER TABLE Docentes
        MODIFY ultimo_nivel_estudios ENUM('Licenciatura', 'Maestría', 'Doctorado'),
        MODIFY academia ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        ${resultsDocentes.some(col => col.COLUMN_NAME === 'rh') ? 'DROP COLUMN rh,' : ''}
        ${resultsDocentes.some(col => col.COLUMN_NAME === 'fecha_nacimiento') ? 'DROP COLUMN fecha_nacimiento,' : ''}
        ${resultsDocentes.some(col => col.COLUMN_NAME === 'telefono') ? 'DROP COLUMN telefono;' : ''}
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Agrega las columnas de vuelta si eliminaste alguna
    await queryInterface.sequelize.query(`
      ALTER TABLE Estudiantes
      MODIFY carrera VARCHAR(255),
      MODIFY semestre VARCHAR(50),
      ADD telefono VARCHAR(20),
      ADD sexo VARCHAR(10);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Reclutadores
      RENAME COLUMN giro TO sector_comercial,
      ADD COLUMN fecha_fundacion DATE,
      ADD COLUMN telefono VARCHAR(15),
      ADD COLUMN sexo ENUM('Masculino', 'Femenino');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Reclutadores
      DROP COLUMN sede,
      MODIFY sector_comercial ENUM('Tecnología', 'Finanzas', 'Salud');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Egresados
      MODIFY carrera VARCHAR(255),
      MODIFY ano_graduacion YEAR,
      MODIFY puesto VARCHAR(255),
      ADD fecha_nacimiento DATE,
      ADD telefono VARCHAR(20),
      ADD sexo VARCHAR(10);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Docentes
      MODIFY ultimo_nivel_estudios VARCHAR(255),
      MODIFY academia VARCHAR(255),
      ADD rh VARCHAR(10),
      ADD fecha_nacimiento DATE,
      ADD telefono VARCHAR(20);
    `);
  }
};
