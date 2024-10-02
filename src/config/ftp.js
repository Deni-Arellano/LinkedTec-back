const ftp = require('basic-ftp');

const FileNotFoundError = require('../middlewares/exceptions/FileNotFoundError');
const FileDownloadError = require('../middlewares/exceptions/FileDownloadError');
const FileUploadError = require('../middlewares/exceptions/FileUploadError');
const ConexionFtpError = require('../middlewares/exceptions/ConexionFtpError');

require('dotenv').config();

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === 'true',
  secureOptions: { rejectUnauthorized: false } // Solo si necesitas deshabilitar la verificación SSL
};

class FTPClient {
  constructor() {
    this.client = new ftp.Client();
  }

  async connect() {
    try {
      await this.client.access(ftpConfig);
      console.log('Conexión FTP establecida con éxito');
    } catch (error) {
      if (error.code === 530) {
        throw new ConexionFtpError('530 - Not logged in: Credenciales incorrectas.');
      } else if (error.code === 421) {
        throw new ConexionFtpError('421 - Service not available: El servicio FTP no está disponible.');
      } else if (error.code === 425) {
        throw new ConexionFtpError("425 - Can't open data connection: No se pudo abrir la conexión de datos.");
      } else if (error.code === 426) {
        throw new ConexionFtpError('426 - Connection closed; transfer aborted: La conexión fue cerrada y la transferencia fue abortada.');
      } else {
        console.error('Error al conectar con el servidor FTP:', error.message);
        throw new ConexionFtpError(`Error inesperado en la conexión FTP: ${error.message}`);
      }
    }
  }

  async disconnect() {
    this.client.close();
  }

  async uploadFile(localPath, remotePath) {
    try {
      await this.client.uploadFrom(localPath, remotePath);
    } catch (error) {
      if (error.code === 550) {
        throw new FileUploadError('550 - Requested action not taken: El archivo no se puede subir. Archivo no encontrado o permiso denegado.');
      } else if (error.code === 452) {
        throw new FileUploadError('452 - Requested action not taken: No se puede subir el archivo debido a espacio insuficiente en el servidor.');
      } else if (error.code === 451) {
        throw new FileUploadError('451 - Requested action aborted: La subida fue abortada debido a un error local.');
      } else {
        console.error('Error inesperado al subir el archivo:', error.message);
        throw new FileUploadError(`Error inesperado en la subida de archivos: ${error.message}`);
      }
    }
  }

  async downloadFile(remotePath, localPath) {
    try {
      await this.client.downloadTo(localPath, remotePath);
    } catch (error) {
      if (error.code === 550) {
        throw new FileDownloadError('550 - Requested action not taken: El archivo no se puede descargar. Archivo no encontrado o permiso denegado.');
      } else if (error.code === 426) {
        throw new FileDownloadError('426 - Connection closed; transfer aborted: La conexión fue cerrada durante la descarga.');
      } else if (error.code === 450) {
        throw new FileDownloadError('450 - Requested file action not taken: La acción solicitada para el archivo no pudo completarse.');
      } else if (error.code === 421) {
        throw new FileDownloadError('421 - Service not available: El servidor FTP no está disponible, no se puede realizar la descarga.');
      } else {
        console.error('Error inesperado al descargar el archivo:', error.message);
        throw new FileDownloadError(`Error inesperado en la descarga de archivos: ${error.message}`);
      }
    }
  }

  async searchFile(remotePath) {
    try {
      const file = await this.client.list(remotePath);
      if (file.length === 0) {
        throw new FileNotFoundError(`Archivo no encontrado en la ruta: ${remotePath}`);
      }
      return file;
    } catch (error) {
      if (error.code === 550) {
        throw new FileNotFoundError('550 - Requested action not taken: Archivo no encontrado o permiso denegado en la búsqueda.');
      } else if (error.code === 451) {
        throw new FileNotFoundError('451 - Requested action aborted: La búsqueda fue abortada debido a un error local.');
      } else {
        console.error('Error inesperado al buscar el archivo:', error.message);
        throw new FileNotFoundError(`Error inesperado en la búsqueda de archivos : ${error.message}`);
      }
    }
  }
}

module.exports = new FTPClient();
