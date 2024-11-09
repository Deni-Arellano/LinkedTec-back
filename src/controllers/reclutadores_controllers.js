const { crearReclutadorServicio, obtenerReclutadorServicio, obtenerTodosReclutadoresServicio, obtenerTodosUsuariosYReclutadores,obtenerReclutadorDetalladoPorIdServicio, obtenerReclutadorPorIdServicio, actualizarReclutadorServicio } = require('../services/services_reclutadores');
const { validarReclutador } = require('../middlewares/validations/validaciones_reclutadores');
const {  validarUsuarioExistente, validarCorreoExistente,validarUsuarioEnUso, validarUsuariosExistentes,   } = require('../middlewares/validations/validaciones_usuarios');
const {validarRegistroUsuario} = require('../middlewares/validations/validaciones_usuarios');
/**
 * Controlador para crear un reclutador.
 * @async
 * @function crearReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el reclutador creado o un error.
 */
const crearReclutador = async (req, res) => {
  const { usuario, reclutador } = req.body;

  const {error} = await validarRegistroUsuario(usuario);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
 

  const { error1 } = validarReclutador(reclutador);
  if (error1) {
    return res.status(400).json({ message: error.details[0].message });
  }
  


  try {
    
    await validarCorreoExistente(usuario.correo);
    

    
    const result = await crearReclutadorServicio(usuario, reclutador);
    return res.status(201).json(result);

  } catch (error) {
  
    if (error.name === 'EmailExistsError') {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    console.error('Error al crear reclutador:', error);
    return res.status(500).json({ message: 'Error al crear reclutador', error: error.message });
  }
};


/**
 * Controlador para obtener un reclutador por su ID.
 * @async
 * @function obtenerReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del reclutador o un error.
 */
const obtenerReclutador = async (req, res) => {
  const { id } = req.params;

  try {
    await validarUsuarioExistente(id);
    const reclutador = await obtenerReclutadorServicio(id);
    
   

    if (reclutador) {
      res.status(200).json({
        nombre: reclutador.Usuario.nombre,
        apellido_paterno: reclutador.Usuario.apellido_paterno,
        apellido_materno: reclutador.Usuario.apellido_materno,
        role: reclutador.Usuario.role,
        correo: reclutador.Usuario.correo,
        telefono: reclutador.Usuario.telefono,
        fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
        sexo: reclutador.Usuario.sexo,
        nombre_empresa: reclutador.nombre_empresa,
        giro: reclutador.giro
      });
    } else {
      res.status(404).json({ message: 'Reclutador no encontrado' });
    }
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    console.error('Error al obtener reclutador:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

/**
 * Controlador para obtener todos los reclutadores.
 * @async
 * @function obtenerTodosReclutadores
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la lista de reclutadores o un error.
 */


const obtenerTodosReclutadores = async (req, res) => {
  try {
    
    const pagina = parseInt(req.query.pagina) || 1; 
    const limite = parseInt(req.query.limite) || 10; 
    const offset = (pagina - 1) * limite; 

   
    const reclutadores = await obtenerTodosReclutadoresServicio(); 

  
    await validarUsuariosExistentes(reclutadores);

    
    const total = reclutadores.length; 
    const totalPaginas = Math.ceil(total / limite); s

    
    const reclutadoresPagina = reclutadores.slice(offset, offset + limite);

    
    const response = {
      total,
      pagina,
      limite,
      total_paginas: totalPaginas,
      pagina_siguiente: {
        url: pagina < totalPaginas ? `http://localhost:3000/usuarios/reclutadores/info?pagina=${pagina + 1}&limite=${limite}` : null,
        exists: pagina < totalPaginas
      },
      pagina_anterior: {
        url: pagina > 1 ? `http://localhost:3000/usuarios/reclutadores/info?pagina=${pagina - 1}&limite=${limite}` : null,
        exists: pagina > 1
      },
      reclutadores: reclutadoresPagina
    };

    
    res.status(200).json(response);
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutadores no encontrados' });
    }

    console.error('Error al obtener todos los reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener reclutadores', error: error.message, stack: error.stack });
  }
};

const obtenerUsuariosYReclutadores = async (req, res) => {
  try {
    
    const pagina = parseInt(req.query.pagina) || 1; 
    const limite = parseInt(req.query.limite) || 10; 
    const offset = (pagina - 1) * limite; 

    
    const reclutadores = await obtenerTodosUsuariosYReclutadores();
    

    await validarUsuariosExistentes(reclutadores);

   
    const total = reclutadores.length; 
    const totalPaginas = Math.ceil(total / limite); 

    
    const reclutadoresPagina = reclutadores.slice(offset, offset + limite);

   
    const response = {
      total,
      pagina,
      limite,
      total_paginas: totalPaginas,
      pagina_siguiente: {
        url: pagina < totalPaginas ? `http://localhost:3000/usuarios/reclutadores?pagina=${pagina + 1}&limite=${limite}` : null,
        exists: pagina < totalPaginas
      },
      pagina_anterior: {
        url: pagina > 1 ? `http://localhost:3000/usuarios/reclutadores?pagina=${pagina - 1}&limite=${limite}` : null,
        exists: pagina > 1
      },
      reclutadores: reclutadoresPagina.map(reclutador => {
        const usuario = reclutador.Usuario || {};
        
        return {
          id: usuario.id || null,
          nombre: usuario.nombre || '',
          apellido_paterno: usuario.apellido_paterno || '',
          apellido_materno: usuario.apellido_materno || '',
          correo: usuario.correo || '',
          contraseña: usuario.contraseña || '',
          fecha_nacimiento: usuario.fecha_nacimiento || null,
          telefono: usuario.telefono || '',
          sexo: usuario.sexo || '',
          biografia: usuario.biografia || '',
          role: usuario.role || '',
          imagen_usuario: usuario.imagen_usuario || '',
          nombre_empresa: reclutador.nombre_empresa || '',
          sede: reclutador.sede || '',
          giro: reclutador.giro || ''
        };
      })
    };

    res.status(200).json(response);
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Usuarios y reclutadores no encontrados' });
    }

    console.error('Error al obtener usuarios y reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener usuarios y reclutadores', error: error.message, stack: error.stack });
  }
};




const obtenerReclutadorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    
    await validarUsuarioExistente(id);
    
   
    const reclutador = await obtenerReclutadorPorIdServicio(id);


    res.status(200).json({
      id: reclutador.id,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    });

  } catch (error) {

    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutador no encontrado' });
     
    }
    else{
      
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
    
  }
};




const obtenerReclutadorDetalladoPorId = async (req, res) => {
  const { id } = req.params;

  try {
   
    await validarUsuarioExistente(id);

  
    const reclutador = await obtenerReclutadorDetalladoPorIdServicio(id);
    console.log(id);
    if (!reclutador || !reclutador.Usuario) {
      return res.status(404).json({ message: 'Reclutador o usuario no encontrado' });
    }

    const response = {
      id: reclutador.Usuario.id,
      nombre: reclutador.Usuario.nombre,
      apellido_paterno: reclutador.Usuario.apellido_paterno,
      apellido_materno: reclutador.Usuario.apellido_materno,
      correo: reclutador.Usuario.correo,
      contraseña: reclutador.Usuario.contraseña,
      fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
      telefono: reclutador.Usuario.telefono,
      sexo: reclutador.Usuario.sexo,
      biografia: reclutador.Usuario.biografia,
      role: reclutador.Usuario.role,
      imagen_usuario: reclutador.Usuario.imagen_usuario,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    };

   
    res.status(200).json(response);
  } catch (error) {
    
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutador no encontrado' });
    }



    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

const actualizarReclutador = async (req, res) => {
  const { id } = req.params;
  const { usuario, reclutador } = req.body;

  try {
    const {error} = await validarRegistroUsuario(usuario);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
  
  
    const { error1 } = validarReclutador(reclutador);
    if (error1) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    await validarUsuarioExistente(id);
    
    const resultado = await actualizarReclutadorServicio(id, usuario, reclutador);


    res.status(200).json({
      message: 'Usuario y reclutador actualizados correctamente',
      usuario: resultado.usuario,
      reclutador: resultado.reclutador
    });
  } catch (error) {


    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.error('Error al actualizar usuario y reclutador:', error);
    res.status(500).json({ message: 'Error al actualizar usuario y reclutador', error: error.message });
  }
};



module.exports = {
  crearReclutador,
  obtenerReclutador,
  obtenerTodosReclutadores,
  obtenerUsuariosYReclutadores,
  obtenerReclutadorPorId,
  obtenerReclutadorDetalladoPorId,
  actualizarReclutador
};