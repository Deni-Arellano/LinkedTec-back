const { Reporte } = require('../models/reportes');
const { Usuario } = require('../models/usuarios');
const { validarRegistroReportes } = require('../middlewares/validations/validaciones_reportes');

const createReporte = async (req, res) => {
    try {
        // Llamamos a la función que realiza la validación
        const { error } = await validarRegistroReportes(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { id_usuario, tipo_reporte, categoria_reporte, descripcion, id_elemento_reportado, titulo_reporte } = req.body;

        // Verifica si el usuario existe antes de crear el reporte
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe.' });
        }

        // Crea el nuevo reporte
        const nuevoReporte = await Reporte.create({
            id_usuario,
            tipo_reporte,
            categoria_reporte,
            descripcion,
            id_elemento_reportado,
            titulo_reporte
        });

        res.status(201).json(nuevoReporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el reporte: ' + error.message });
    }
};

module.exports = { createReporte };
