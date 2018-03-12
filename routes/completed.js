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
  Todo.findOneAndUpdate(
    { itemType: ["all", "active"] },
    { $set: {itemType: ["all", "completed"]} }
  ).exec((err, todo_list) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ success: 'success'});
    }
  });
});

router.delete('/', function (req, res, next) {
  console.log(req.body);
});

export default router;
