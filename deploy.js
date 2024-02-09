const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
require('dotenv').config();

const config = {
  user: process.env.FTP_USER,
  // Password optional, prompted if none given
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_SERVER,
  port: process.env.PORT,
  localRoot: __dirname + '/build',
  remoteRoot: process.env.FTP_REMOTE_FOLDER,
  // include: ["*", "**/*"],      // this would upload everything except dot files
  include: ['*'],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  exclude: [
    'dist/**/*.map',
    'node_modules/**',
    'node_modules/**/.*',
    '.git/**',
  ],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: true,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: true,
  // use sftp or ftp
  sftp: false,
};

ftpDeploy
  .deploy(config)
  .then((res) => console.log('finished:', res))
  .catch((err) => console.log(err));
