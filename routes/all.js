import express from 'express';
import Todo from'../models/todo';

let router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  Todo.find({}).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(todo_list);
    }
  });
});

router.post('/', function(req, res, next) {
  const data = Object.keys(req.body);
  const {id, itemName, itemType} = JSON.parse(data[0]);
  console.log(id);
  console.log(itemType);
  console.log(itemName);
  const todo_list = new Todo({
    id: id,
    itemName: itemName,
    itemType: itemType
  });
  todo_list.save((err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: true });
    }
  })
});

router.delete('/', function(req, res, next) {
  console.log(req.body);
});

export default router;
