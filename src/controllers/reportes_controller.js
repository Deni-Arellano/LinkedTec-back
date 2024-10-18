const Reporte = require('../models/reportes'); // Asegúrate de que esta ruta sea correcta
const Usuario = require('../models/usuarios');
const { validarRegistroReportes } = require('../middlewares/validations/validaciones_reportes');

const createReporte = async (req, res) => {
    try {
        // Validar el cuerpo de la solicitud con Joi
        const { error } = validarRegistroReportes(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { id_usuario, tipo_reporte, categoria_reporte, descripcion, id_elemento_reportado, titulo_reporte } = req.body;

        // Verificar si el ID de usuario es válido
        if (!id_usuario) {
            return res.status(400).json({ error: 'El ID del usuario es requerido.' });
        }

        // Verificar si el usuario existe
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
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ error: 'Error al crear el reporte: ' + error.message });
    }
};

module.exports = { createReporte };
