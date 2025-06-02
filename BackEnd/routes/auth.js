const express = require('express');

// Cria um novo roteador (router) do Express, para definir rotas separadas.
const router = express.Router();

// Importa o modelo User, que representa a estrutura do usuário no banco de dados.
const User = require('../models/User');

// Importa o jsonwebtoken, biblioteca para criar e verificar tokens JWT.
const jwt = require('jsonwebtoken');

// Define uma chave secreta para assinar os tokens JWT.
const JWT_SECRET = 'seu_segredo_super_secreto'; //Altere para uma chave mais segura e utilioze o .env para armazenar essa chave de forma segura
/*
======================================
|         ROTA: Registrar usuário    |
|         MÉTODO: POST               |
|         ENDPOINT: /register        |
======================================
*/
router.post('/register', async (req, res) => {
  // Extrai os dados enviados no corpo da requisição.
  const { firstName, email, password } = req.body;

  // Valida se todos os campos foram preenchidos.
  if (!firstName || !email || !password) {
    return res.status(400).json({ msg: 'Preencha todos os campos' });
  }

  try {
    // Verifica se já existe um usuário com o mesmo e-mail.
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email já cadastrado' });

    // Cria uma nova instância de usuário.
    // A senha será processada (criptografada) no model, via middleware 'pre save'.
    const user = new User({
      firstName,
      email,
      passwordHash: password // Envia a senha como 'passwordHash', será hashada antes de salvar.
    });

    // Salva o novo usuário no banco de dados.
    await user.save();

    // Retorna resposta de sucesso.
    res.status(201).json({ msg: 'Usuário criado com sucesso!' });
  } catch (err) {
    // Em caso de erro no servidor, retorna status 500.
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

/*
======================================
|         ROTA: Login                |
|         MÉTODO: POST               |
|         ENDPOINT: /login           |
======================================
*/
router.post('/login', async (req, res) => {
  // Extrai e-mail e senha enviados na requisição.
  const { email, password } = req.body;

  // Valida se os campos foram preenchidos.
  if (!email || !password) return res.status(400).json({ msg: 'Preencha todos os campos' });

  try {
    // Procura o usuário pelo e-mail.
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

    // Compara a senha fornecida com o hash armazenado.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

    // Se tudo OK, cria um token JWT com o ID do usuário.
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' }); // Token válido por 1 dia.

    // Retorna o token e alguns dados do usuário.
    res.json({ token, firstName: user.firstName, email: user.email });
  } catch (err) {
    // Em caso de erro no servidor.
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

/*
======================================
|     MIDDLEWARE: Autenticação JWT   |
======================================
*/
const authMiddleware = (req, res, next) => {
  // Extrai o cabeçalho Authorization.
  const authHeader = req.headers.authorization;

  // Se não existir, bloqueia o acesso.
  if (!authHeader) return res.status(401).json({ msg: 'Token não fornecido' });

  // Extrai o token do formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token mal formatado' });

  try {
    // Verifica e decodifica o token.
    const decoded = jwt.verify(token, JWT_SECRET);

    // Armazena o ID do usuário no objeto 'req' para uso nas próximas funções.
    req.userId = decoded.id;

    // Continua a execução para a próxima função (rota protegida).
    next();
  } catch (err) {
    // Token inválido ou expirado.
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

/*
======================================
|         ROTA: Obter perfil         |
|         MÉTODO: GET                |
|         ENDPOINT: /me              |
|         Protegida: Sim             |
======================================
*/
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Busca o usuário pelo ID armazenado pelo middleware.
    // Exclui o campo 'passwordHash' do retorno.
    const user = await User.findById(req.userId).select('-passwordHash');

    // Se usuário não for encontrado.
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    // Retorna os dados do usuário.
    res.json(user);
  } catch (err) {
    // Erro no servidor.
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Exporta o roteador para que ele possa ser usado em outros arquivos, como app.js ou server.js.
module.exports = router;
