const ftp = require('basic-ftp');
const config = require('../../config/config')[process.env.NODE_ENV || 'development'];

exports.uploadFile = async (localPath, remotePath) => {
  const client = new ftp.Client();
  try {
    await client.access(config.ftp);
    await client.uploadFrom(localPath, remotePath);
  } finally {
    client.close();
  }
};
