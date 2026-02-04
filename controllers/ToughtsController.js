const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    res.render('toughts/home');
  }

  static async dashboard(req, res) {
    const userid = req.session.userid;

    const user = await User.findOne({
      where: { id: userid },
      include: Tought,
      plain: true
    });

    if (!user) {
      res.redirect('/login');
      return;
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false;

    if(toughts.length === 0){
      emptyToughts = true;
    }

    res.render('toughts/dashboard', { toughts, emptyToughts });
  }

  static async addTought(req, res) {
    res.render('toughts/add');
  }
  
  static async addToughtSave(req, res) {
    
    const tought = {
      title: req.body.title,
      UserId: req.session.userid
    };

    if(title === ''){
      req.flash('message', 'O campo não pode s')
    }
   
    try {
      await Tought.create(tought);

      req.flash('message', 'Pensamento adicionado com sucesso!');

      req.session.save(() => {
      res.redirect('/toughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userid = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: userid } });
      req.flash('message', 'Pensamento removido com sucesso!');
      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }
};