var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json('[{"id": 2, "value": 2}]');
});

router.post('/', function (req, res, next) {
  res.status(200);
  res.send('success');
});

router.delete('/', function (req, res, next) {
  console.log(req.body);
});

module.exports = router;
