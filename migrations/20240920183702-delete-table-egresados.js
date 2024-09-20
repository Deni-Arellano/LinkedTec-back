'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar la tabla "egresados" si existe
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS egresados;
    `);
    console.log("Tabla 'egresados' eliminada si existía.");
  },

  down: async (queryInterface, Sequelize) => {
    // Si quieres agregar de nuevo la tabla "egresados" en la reversión (opcional)
    await queryInterface.sequelize.query(`
      CREATE TABLE egresados (
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
  }
};
