// Importa o framework Express para criar o servidor
const express = require('express');

// Importa o Mongoose para conectar e manipular o banco de dados MongoDB
const mongoose = require('mongoose');

// Importa o CORS para permitir requisições de outros domínios (Cross-Origin Resource Sharing)
const cors = require('cors');

// Importa as rotas definidas separadamente em arquivos
const userRoutes = require('./routes/userRoutes');   // Rotas relacionadas aos usuários
const authRoutes = require('./routes/auth');         // Rotas de autenticação (registro, login, etc.)

// Cria uma instância do aplicativo Express
const app = express();

// Aplica o middleware CORS para permitir chamadas de APIs de diferentes origens
app.use(cors());

// Aplica o middleware que permite o Express interpretar JSON no corpo das requisições
app.use(express.json());

/*
===============================================
|   CONEXÃO COM O BANCO DE DADOS MONGODB     |
===============================================
*/

// Faz a conexão com o MongoDB Atlas através da URL de conexão (substituir 'seu_banco' pelo nome real)
mongoose.connect('mongodb+srv://crosfyrenonear:Gjewi200.2@alunos.ja4xu.mongodb.net/seu_banco?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB conectado!')) // Se conectar com sucesso, exibe mensagem
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err)); // Se der erro, exibe mensagem

/*
===============================================
|   REGISTRO DAS ROTAS                       |
===============================================
*/

// Define que todas as rotas relacionadas a usuários terão o prefixo /users
app.use('/users', userRoutes);


// Define que todas as rotas relacionadas à autenticação terão o prefixo /auth
app.use('/auth', authRoutes);

/*
===============================================
|   INICIALIZAÇÃO DO SERVIDOR                |
===============================================
*/

// Define a porta em que o servidor vai rodar
const PORT = 5000;

// Inicia o servidor e exibe mensagem no console quando estiver rodando
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
