const mysql = require('mysql2/promise');
require('dotenv').config();
//console.log(process.env);

const dbSettingsLocal = {
    host:'localhost',
    user:process.env.LOCALUSERDB,
    password: process.env.LOCALPASSWORDDB,
    port: process.env.LOCALPORT,
    database: process.env.LOCALDATABASE,
    timezone: 'Z'  //PARA TRABAJAR EN UTC SIN CONVERSIONES DE ZONA HORARIA
};

const dbSettingsRemoto = {
    host:process.env.REMOTOHOSTDB,
    user:process.env.REMOTOUSERDB,
    password: process.env.REMOTOPASSWORDDB,
    database: process.env.REMOTODATABASE,
    timezone: 'Z'
}; 

const pool = mysql.createPool(dbSettingsLocal);

module.exports = pool;
