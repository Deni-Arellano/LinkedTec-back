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
  secureOptions: { rejectUnauthorized: false }
};

class FTPClient {
  constructor() {
    this.client = new ftp.Client();
    this.isConnected = false;
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.access(ftpConfig);
        this.isConnected = true;
        console.log('Conexión FTP establecida con éxito');
      } catch (error) {
        this.handleConnectionError(error);
      }
    }
  }

  disconnect() {
    if (this.isConnected) {
      this.client.close();
      this.isConnected = false;
    }
  }

  async uploadFile(localPath, remotePath) {
    await this.connect(); // Asegúrate de que estás conectado
    try {
      await this.client.uploadFrom(localPath, remotePath);
    } catch (error) {
      this.handleUploadError(error);
    }
  }

  async downloadFile(remotePath, localPath) {
    await this.connect(); // Asegúrate de que estás conectado
    try {
      await this.client.downloadTo(localPath, remotePath);
    } catch (error) {
      this.handleDownloadError(error);
    }
  }

  async searchFile(remotePath) {
    await this.connect(); // Asegúrate de que estás conectado
    try {
      const file = await this.client.list(remotePath);
      if (file.length === 0) {
        throw new FileNotFoundError(`Archivo no encontrado en la ruta: ${remotePath}`);
      }
      return file;
    } catch (error) {
      this.handleSearchError(error);
    }
  }

  handleConnectionError(error) {
    if (error.code === 530) {
      throw new ConexionFtpError('530 - Not logged in: Credenciales incorrectas.');
    } else if (error.code === 421) {
      throw new ConexionFtpError('421 - Service not available: El servicio FTP no está disponible.');
    } else if (error.code === 425) {
      throw new ConexionFtpError("425 - Can't open data connection: No se pudo abrir la conexión de datos.");
    } else if (error.code === 426) {
      throw new ConexionFtpError('426 - Connection closed; transfer aborted: La conexión fue cerrada y la transferencia fue abortada.');
    } else {
      throw new ConexionFtpError(`Error inesperado en la conexión FTP: ${error.message}`);
    }
  }

  handleUploadError(error) {
    if (error.code === 550) {
      throw new FileUploadError('550 - Requested action not taken: El archivo no se puede subir. Archivo no encontrado o permiso denegado.');
    } else if (error.code === 452) {
      throw new FileUploadError('452 - Requested action not taken: No se puede subir el archivo debido a espacio insuficiente en el servidor.');
    } else if (error.code === 451) {
      throw new FileUploadError('451 - Requested action aborted: La subida fue abortada debido a un error local.');
    } else {
      throw new FileUploadError(`Error inesperado en la subida de archivos: ${error.message}`);
    }
  }

  handleDownloadError(error) {
    if (error.code === 550) {
      throw new FileDownloadError('550 - Requested action not taken: El archivo no se puede descargar. Archivo no encontrado o permiso denegado.');
    } else if (error.code === 426) {
      throw new FileDownloadError('426 - Connection closed; transfer aborted: La conexión fue cerrada durante la descarga.');
    } else if (error.code === 450) {
      throw new FileDownloadError('450 - Requested file action not taken: La acción solicitada para el archivo no pudo completarse.');
    } else if (error.code === 421) {
      throw new FileDownloadError('421 - Service not available: El servidor FTP no está disponible, no se puede realizar la descarga.');
    } else {
      throw new FileDownloadError(`Error inesperado en la descarga de archivos: ${error.message}`);
    }
  }

  handleSearchError(error) {
    if (error.code === 550) {
      throw new FileNotFoundError('550 - Requested action not taken: Archivo no encontrado o permiso denegado en la búsqueda.');
    } else if (error.code === 451) {
      throw new FileNotFoundError('451 - Requested action aborted: La búsqueda fue abortada debido a un error local.');
    } else {
      throw new FileNotFoundError(`Error inesperado en la búsqueda de archivos: ${error.message}`);
    }
  }
}

module.exports = new FTPClient();
