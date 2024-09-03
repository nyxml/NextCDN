// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Sesuaikan dengan username MySQL Anda
  password: '', // Sesuaikan dengan password MySQL Anda
  database: 'n', // Sesuaikan dengan nama database Anda
});

export default pool;
