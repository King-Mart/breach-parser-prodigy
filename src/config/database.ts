import mysql from 'mysql2';

export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'deepcode',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

export const createPool = () => {
  return mysql.createPool(dbConfig);
};