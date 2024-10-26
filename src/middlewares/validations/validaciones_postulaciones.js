const sequelize = require('../../config/database');
const PostulacionNotFoundError = require('../exceptions/postulaciones/PostulacionNotFoundError');






const validarPostulacionExistente = async (id_postulacion) => {
  const postulacion = await sequelize.query('SELECT * FROM postulacion WHERE id_postulacion = ?', {
    replacements: [id_postulacion],
    type: sequelize.QueryTypes.SELECT,
    
  });
  if (postulacion.length === 0) {
    throw new PostulacionNotFoundError();
  }
};

module.exports = {
    validarPostulacionExistente
}