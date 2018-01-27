const models = require('../models');

function get(req, res) {
  const page = req.query.page || 1;
  const listId = req.query.listId || 1;
  const userId = req.user.sub;
  console.log(req.query);

  models.Words.findAll({
    where: {
      listId: listId,
      userId: userId,
      status: 0,
    },
    offset: (page - 1) * 30,
    limit: 30,
    order: [
      ['id', 'DESC'],
    ],
  }).then(function(words) {
    res.send({
      words: words,
    });
  });
}

function create(req, res) {
  const newWord = req.body.word;
  const listId = req.body.listId || 1;
  const userId = req.user.sub;
  
  if (!newWord) {
    const message = 'Invalid word entry';
    console.warn(message);
    res.send({
      status: -1,
      message: message,
    });
  }

  models.Words.create({
    text: newWord,
    listId: listId,
    userId: userId,
    status: 0,
  })
  .then(w => {
    res.send({
      status: 0,
      id: w.id,
      text: w.text,
      listId: w.listId,
      userId: w.userId,
    });
  })
  .catch(error => {
    const message = 'Failed to save new word';
    console.error(message);
    res.send({
      status: -1,
      message: message,
    });
  });
}

function move(req, res) {
  const wordId = req.body.wordId;
  const listId = req.body.listId || 1;
  const userId = req.user.sub;

  models.Words.update({
    listId: listId,
  }, {
    where: {
      id: wordId,
      status: 0,
    },
  }).then(w => {
    res.send({
      status: 0,
      id: w.id,
      text: w.text,
      listId: w.listId,
      userId: w.userId,
    });
  })
  .catch(error => {
    const message = 'Failed to move word';
    console.error(message);
    res.send({
      status: -1,
      message: message,
    });
  });
}

module.exports = {
  create,
  get,
  move,
};
