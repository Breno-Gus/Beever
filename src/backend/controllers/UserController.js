const User = require('../models/User');
const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

exports.register = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    const novoUsuario = await User.createUser(email, senha);

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: novoUsuario
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async(req, res) => {

  try{
    const {email, senha} = req.body

    if(!email || !senha){//se estiver vazio
      return res.status(400).json({ message: "E-mail e senha são obrigatórios" })
    }

    //se user existe
    const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email])
    if(rows.length === 0){
      return res.status(400).json({ message: "E-mail inválido" })
    }

    //compara senha com hash
    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if(!senhaCorreta){
      return res.status(400).json({ message: "Senha inválida" })
    }

    //atualiza ultimo login
    await db.query("UPDATE Usuario SET ultimo_login = NOW() WHERE id = ?", [usuario.id])

    //criando sessao
    const [sessao] = await db.query(
      'INSERT INTO Sessao (id_user_sessao, id_jogos, data_inicio, data_fim, pontos_obtidos, moedas_ganhas) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 20 MINUTE), ?, ?)',
      [usuario.id, 2, 0, 0]
    )


    //retorno de sucesso
    res.json({
      message: "Login realizado com sucesso!",
      user: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      },
      sessao_id: sessao.insertId,
      data_inicio: new Date(),
      data_fim: new Date(Date.now() + 20 * 60 * 1000)
    })
  } catch(e){
    console.error("ERRO DE LOGIN: ", e)
    res.status(500).json({error: e.message})
  }

}
