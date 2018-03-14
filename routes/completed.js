import express from 'express';
import Todo from '../models/todo';

let router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  Todo.find({ itemType: ["all", "completed"] }).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(todo_list);
    }
  });
});

router.post('/', function (req, res, next) {
  const data = Object.keys(req.body);
  const { itemName, itemType } = JSON.parse(data[0]);
  Todo.findOneAndUpdate(
    { itemName: itemName },
    { $set: {itemType: itemType} }
  ).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: 'success'});
    }
  });
});

router.delete('/', function (req, res, next) {
  const data = Object.keys(req.body);
  const { itemName, itemType } = JSON.parse(data[0]);
  Todo.findOneAndRemove({
    itemName: itemName,
    itemType: itemType
  }).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

router.delete('/clear', function (req, res, next) {
  Todo.remove({
    itemType: ['all', 'completed']
  }).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

export default router;
