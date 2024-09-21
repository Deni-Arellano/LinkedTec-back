const Usuario = require('../models/usuarios');
const Reclutador = require('../models/reclutadores');

const crearReclutadorServicio = async (usuarioData, reclutadorData) => {
  try {
    // Crear el usuario primero
    const nuevoUsuario = await Usuario.create({
      nombre: usuarioData.nombre,
      apellido_paterno: usuarioData.apellido_paterno,
      apellido_materno: usuarioData.apellido_materno,
      correo: usuarioData.correo,
      contraseña: usuarioData.contrasena, // Asegúrate de que este campo esté bien definido en el modelo
      tipo_usuario: usuarioData.tipo_usuario,
      telefono: usuarioData.telefono,
      sexo: usuarioData.sexo,
      biografia: usuarioData.biografia,
      fecha_nacimiento: usuarioData.fecha_nacimiento, // Corrige el typo aquí
      role: 'Empleador'
    });
    
    console.log('ID del nuevo usuario:', nuevoUsuario.id);
    await Reclutador.create({
      id: nuevoUsuario.id, // Relacionar correctamente con el usuario creado
      nombre_empresa: reclutadorData.nombre_empresa,
      sector_comercial: reclutadorData.sector_comercial,
      sede: reclutadorData.sede,
      giro: reclutadorData.giro
    });

    return { message: 'Reclutador creado exitosamente' };
  } catch (error) {
    console.error('Error en crearReclutadorServicio:', error);
    throw new Error('Error al crear reclutador');
  }
};

// Función para obtener un reclutador
const obtenerReclutadorServicio = async (id) => {
  try {
    const reclutador = await Reclutador.findOne({ where: { id } });
    if (!reclutador) {
      throw new Error('Reclutador no encontrado');
    }
    return reclutador;
  } catch (error) {
    console.error('Error en obtenerReclutadorServicio:', error);
    throw new Error('Error al obtener reclutador');
  }
};

module.exports = {
  crearReclutadorServicio,
  obtenerReclutadorServicio,
};
