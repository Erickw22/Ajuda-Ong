// Importa o Express, um framework para construção de APIs em Node.js
const express = require('express');

// Cria uma instância do router para definir rotas de forma modular
const router = express.Router();

// Importa a biblioteca bcryptjs para realizar o hash e a comparação de senhas
const bcrypt = require('bcryptjs');

// Importa o modelo 'User', que representa a estrutura dos usuários no banco de dados
const User = require('../models/User');

/*
==========================================
|         ROTA: Registrar usuário       |
|         MÉTODO: POST                  |
|         ENDPOINT: /register           |
==========================================
*/
router.post('/register', async (req, res) => {
  // Extrai os campos enviados no corpo da requisição
  const { firstName, lastName, email, password } = req.body;

  // Valida se todos os campos foram preenchidos
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
  }

  // Verifica se já existe um usuário com o mesmo email
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ msg: 'Usuário já existe' });
  }

  // Gera o hash da senha com fator de custo 10
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria uma nova instância de User com os dados preenchidos
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword // Armazena a senha já criptografada
  });

  try {
    // Salva o usuário no banco de dados
    await user.save();

    // Retorna uma mensagem de sucesso e os dados do usuário (sem a senha!)
    res.json({ msg: 'Usuário registrado com sucesso', user });
  } catch (error) {
    // Em caso de erro, exibe no console e retorna erro 500
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ msg: 'Erro interno ao salvar usuário' });
  }
});

/*
==========================================
|           ROTA: Login de usuário       |
|           MÉTODO: POST                 |
|           ENDPOINT: /login             |
==========================================
*/
router.post('/login', async (req, res) => {
  // Extrai os campos enviados no corpo da requisição
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo email
    const user = await User.findOne({ email });

    // Se não encontrar, retorna erro 400
    if (!user) {
      return res.status(400).json({ msg: 'Usuário não encontrado' });
    }

    // Compara a senha enviada com a senha armazenada (hash)
    const isMatch = await bcrypt.compare(password, user.password);

    // Se a senha não for correspondente, retorna erro
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha incorreta' });
    }

    // Se tudo estiver certo, retorna mensagem de sucesso e dados do usuário (sem senha!)
    res.json({
      msg: 'Login bem-sucedido',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    // Em caso de erro, exibe no console e retorna erro 500
    console.error(error);
    res.status(500).json({ msg: 'Erro interno no login' });
  }
});

// Exporta o router para ser utilizado em outros arquivos (por exemplo: app.js)
module.exports = router;
