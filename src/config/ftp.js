const ftp = require('basic-ftp');
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
    } catch (err) {
      console.error('Error al conectar con el servidor FTP:', err.message);
      throw err;
    }
  }

  async disconnect() {
    this.client.close();
  }

  async uploadFile(localPath, remotePath) {
    try {
      await this.client.uploadFrom(localPath, remotePath);
      console.log('Archivo subido con éxito');
    } catch (err) {
      console.error('Error al subir el archivo:', err.message);
      throw err;
    }
  }

  async downloadFile(remotePath, localPath) {
    try {
        await this.client.downloadTo(localPath, remotePath);
    } catch (err) {
        console.error('Error al descargar archivo:', err);
        throw err;
    }
    
  }

  async searchFile(remotePath) {
    try {
      const file = await this.client.list(remotePath);
      return file;
    } catch (err) {
      console.error('Error al buscar archivo:', err);
      throw err;
    }
  }


}

module.exports = new FTPClient();
