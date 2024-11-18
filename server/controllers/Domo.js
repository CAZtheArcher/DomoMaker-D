const models = require('../models');

const Domo = models.Domo;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.power) {
    return res.status(400).json({ error: 'Name, age, and power level are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    power: req.body.power,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, power: newDomo.power });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An unexpected error has occured!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age power').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name of domo to remove is required!' });
  }
  const deletedDomos = await Domo.deleteOne({ name: req.body.name });

  return res.status(200).json({ deleteCount: deletedDomos.deletedCount });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
