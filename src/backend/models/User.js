const db = require('../config/db');

async function getUsers() {
  const [rows] = await db.query('SELECT * FROM Usuario'); // garante que a tabela está com o nome certo
  return rows;
}

module.exports = { getUsers };
