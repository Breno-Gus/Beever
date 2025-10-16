const db = require('../config/db');
const bcrypt = require('bcrypt');

async function getUsers() {
  const [rows] = await db.query('SELECT * FROM Usuario'); // garante que a tabela está com o nome certo
  return rows;
}

async function createUser(email, senha){

  const saltRounds = 10;
  const hash = await bcrypt.hash(senha, saltRounds);

  // gera nome comum
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const nome = `beeuser_${randomNum}`;

  const [result] = await db.query(
    'INSERT INTO Usuario (nome, email, data_nasc, senha, data_criacao, ultimo_login, status, moedas, tipo_usuario) VALUES (?,?,?,?,NOW(),NOW(),?,?,?)', 
    [
      nome, email, null, hash, 'ativo', 0, 'comum'
    ]
  );

  return {id: result.insertId, nome, email}
}

module.exports = { getUsers };
module.exports = { createUser };
