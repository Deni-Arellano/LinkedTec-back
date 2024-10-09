const Usuario = require('../models/usuarios');
const Reclutador = require('../models/reclutadores');

/**
 * @async
 * 
 * Función para crear un nuevo reclutador.
 * @param {Object} usuarioData - Datos del usuario que se va a crear.
 * @param {Object} reclutadorData - Datos del reclutador que se va a crear.
 * @returns {Promise<Object>} El usuario y el reclutador creados.
 */
const crearReclutadorServicio = async (usuarioData, reclutadorData) => {
  try {
    const nuevoUsuario = await Usuario.create({
      nombre: usuarioData.nombre,
      apellido_paterno: usuarioData.apellido_paterno,
      apellido_materno: usuarioData.apellido_materno,
      correo: usuarioData.correo,
      contraseña: usuarioData.contrasena,
      tipo_usuario: usuarioData.tipo_usuario,
      telefono: usuarioData.telefono,
      sexo: usuarioData.sexo,
      biografia: usuarioData.biografia,
      fecha_nacimiento: usuarioData.fecha_nacimiento,
      role: 'Reclutadores',
      imagen_usuario: usuarioData.imagen_usuario
    });

    console.log('ID del nuevo usuario:', nuevoUsuario.id);

    const nuevoReclutador = await Reclutador.create({
      id: nuevoUsuario.id, 
      nombre_empresa: reclutadorData.nombre_empresa,
      sede: reclutadorData.sede,
      giro: reclutadorData.giro
    });

    return {
      usuario: nuevoUsuario,
      reclutador: nuevoReclutador
    };
  } catch (error) {
    console.error('Error en crearReclutadorServicio:', error);
    throw new Error('Error al crear reclutador');
  }
};

/**
 * @async
 * 
 * Función para obtener un reclutador por su ID.
 * @param {number} id - ID del reclutador a obtener.
 * @returns {Promise<Object>} El reclutador encontrado.
 */
const obtenerReclutadorServicio = async (id) => {
  try {
    const reclutador = await Reclutador.findOne({
      where: { id },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'telefono', 'fecha_nacimiento', 'sexo', 'role'],
          // Asegúrate de que la asociación se haga con la clave foránea correcta
        }
      ]
    });

    if (!reclutador) {
      throw new Error('Reclutador no encontrado');
    }

    return reclutador;
  } catch (error) {
    console.error('Error en obtenerReclutadorServicio:', error);
    throw new Error('Error al obtener reclutador');
  }
};

/**
 * @async
 * 
 * Función para obtener todos los reclutadores.
 * @returns {Promise<Array>} Lista de reclutadores.
 */
const obtenerTodosReclutadoresServicio = async () => {
  try {
    const reclutadores = await Reclutador.findAll();
    return reclutadores;
  } catch (error) {
    console.error('Error en obtenerTodosReclutadoresServicio:', error);
    throw new Error('Error al obtener todos los reclutadores');
  }
};


const obtenerTodosUsuariosYReclutadores = async () => {
  try {
    const reclutadores = await Reclutador.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'contraseña', 'fecha_nacimiento', 'telefono', 'sexo', 'biografia', 'role', 'imagen_usuario']
        }
      ]
    });
    return reclutadores;
  } catch (error) {
    console.error('Error en obtenerTodosUsuariosYReclutadores:', error);
    throw new Error('Error al obtener todos los reclutadores');
  }
};
const obtenerReclutadorPorIdServicio = async (id) => {
  try {
    const reclutador = await Reclutador.findOne({
      where: { id }
    });

    if (!reclutador) {
      throw new Error('Reclutador no encontrado');
    }

    return reclutador;
  } catch (error) {
    console.error('Error en obtenerReclutadorPorIdServicio:', error);
    throw new Error('Error al obtener reclutador');
  }
};

const obtenerReclutadorDetalladoPorIdServicio = async (id) => {
  try {
    const reclutador = await Reclutador.findOne({
      where: { id },
      include: {
        model: Usuario,
        attributes: [
          'id', 
          'nombre', 
          'apellido_paterno', 
          'apellido_materno', 
          'correo', 
          'contraseña', 
          'fecha_nacimiento', 
          'telefono', 
          'sexo', 
          'biografia', 
          'role', 
          'imagen_usuario'
        ]
      }
    });

    return reclutador;
  } catch (error) {
    console.error('Error al obtener reclutador por ID en el servicio:', error);
    throw error; // Lanzamos el error para que sea manejado por el controlador
  }
};



const actualizarReclutadorServicio = async (id, datosActualizados) => {
  try {
    const reclutador = await Reclutador.findOne({ where: { id } });
    
    if (!reclutador) {
      throw new Error('Reclutador no encontrado');
    }
    await reclutador.update({
      nombre_empresa: datosActualizados.nombre_empresa,
      sede: datosActualizados.sede,
      giro: datosActualizados.giro
    });

    return reclutador;
  } catch (error) {
    console.error('Error en actualizarReclutadorServicio:', error);
    throw new Error('Error al actualizar reclutador');
  }
};


module.exports = {

  crearReclutadorServicio,
  obtenerReclutadorServicio,
  obtenerTodosReclutadoresServicio,
  obtenerTodosUsuariosYReclutadores,
  obtenerReclutadorPorIdServicio,
  obtenerReclutadorDetalladoPorIdServicio,
  actualizarReclutadorServicio,
  obtenerReclutadorDetalladoPorIdServicio,
};