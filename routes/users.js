var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.session,req.user)
  res.send('respond with a resource');
});

module.exports = router;






