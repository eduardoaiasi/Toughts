const Tought = require('../models/Tought');
const User = require('../models/User');

module.exports = class ToughtsController {
  static async showToughts(req, res) {

    let search = ''; 

    if(req.query.search){
      search = req.query.search;
    }

    let order = 'DESC';

    if(req.query.order === 'old'){
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    const toughtsData = await Tought.findAll({ 
      include: User,
      where: {
        title: {
          [require('sequelize').Op.like]: `%${search}%`
        }
      },
      order: [['createdAt', order]],
    });

    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;

    if(toughtsQty === 0){
      toughtsQty = false;
    }

    res.render('toughts/home', { toughts, search, toughtsQty });
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

  static async editTought(req, res) {
    const id = req.params.id;
    const tought = await Tought.findOne({ where: { id: id }, raw: true }); //puxa tarefa do banco
    res.render('toughts/edit', { tought });
  }

  static async editToughtSave(req, res) {
    const id = req.params.id; //id da tought na url
    const tought = {
      title: req.body.title
    };
    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash('message', 'Pensamento editado com sucesso!');
      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      }
      );
    } catch (err) {
      console.log(err);
    }
  }
};