const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    
    //validations
    //verifica se os campos estão preenchidos
    if (!email || !password) {
      req.flash('message', 'Por favor, preencha todos os campos.');
      res.render('auth/login');
      return;
    }

    //check if user exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash('message', 'Usuário não encontrado.');
      res.render('auth/login');
      return;
    }

    //check if password matches
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash('message', 'Senha incorreta.');
      res.render('auth/login');
      return;
    }

    //salva a sessão do usuário
    req.session.userid = user.id;

    req.flash('message', 'Login realizado com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }

   static register(req, res) {
    res.render('auth/register');
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validations
    if (password != confirmPassword) {
      req.flash('message', 'As senhas não coincidem, tente novamente.');
      res.render('auth/register');
      return;
    }
    
    // check if user exists
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash('message', 'O e-mail já está vinculado a uma conta.');
      res.render('auth/register');
      return;
    }

    // create password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = { name, email, password: hashedPassword };

    try {
      const createdUser = await User.create(user);

      // initialize session
      req.session.userid = createdUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      });
    } catch (error) {
      req.flash('message', 'Erro ao cadastrar usuário.');
      res.redirect('/register');
    }
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};