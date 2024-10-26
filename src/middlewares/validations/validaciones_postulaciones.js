const sequelize = require('../../config/database');
const PostulacionNotFoundError = require('../exceptions/PostulacionNotFoundError');





const validarPostulacionExistente = async (id_postulacion) => {
  const postulacion = await sequelize.query('SELECT * FROM postulaciones WHERE id = ?', {
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