const mongoose = require('mongoose');

// Importa o bcryptjs, uma biblioteca para gerar e comparar hashes de forma segura.
// Utilizamos o bcrypt para armazenar as senhas de forma segura (não armazenamos a senha em texto puro).
const bcrypt = require('bcryptjs');

// Define o Schema (estrutura) de um 'User' (usuário).
const UserSchema = new mongoose.Schema({
  
  // Campo 'firstName': tipo String, obrigatório.
  // Armazena o primeiro nome do usuário.
  firstName: { 
    type: String, 
    required: true 
  },

  // Campo 'email': tipo String, obrigatório e único.
  // O 'unique: true' garante que não haverá dois usuários com o mesmo e-mail.
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // Campo 'passwordHash': tipo String, obrigatório.
  // Aqui será armazenado o hash da senha do usuário.
  // Nunca devemos armazenar a senha em texto puro!
  passwordHash: { 
    type: String, 
    required: true 
  }
});

// Método de instância chamado 'comparePassword'.
// Esse método permite comparar uma senha fornecida pelo usuário (em texto puro)
// com o 'passwordHash' armazenado no banco.
// Retorna 'true' se a senha for correspondente, 'false' caso contrário.
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Middleware 'pre-save': executa antes de salvar o documento no banco.
// Aqui garantimos que sempre que um usuário for criado ou a senha for modificada,
// o 'passwordHash' será criptografado automaticamente.
UserSchema.pre('save', async function(next) {
  
  // Se o campo 'passwordHash' não foi modificado, passa para a próxima função.
  if (!this.isModified('passwordHash')) return next();

  // Gera um 'salt', que é um valor aleatório que aumenta a segurança do hash.
  const salt = await bcrypt.genSalt(10);
  
  // Gera o hash da senha utilizando o salt.
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

  // Chama a próxima função da cadeia de middlewares.
  next();
});

// Exporta o modelo 'User' com base no 'UserSchema'.
// Isso nos permite interagir com a coleção 'users' no MongoDB.
// Exemplo de uso: const User = require('./models/User');
// E então: User.find(), User.create(), user.comparePassword(), etc.
module.exports = mongoose.model('User', UserSchema);
