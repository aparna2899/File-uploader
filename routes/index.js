var express = require('express');
var router = express.Router();
var passport = require('passport');
var fileType = require('file-type');

router.get('/failure', (req, res) => {
  res.status(401).json({ msg: 'Failure' });
});

router.get('/success', (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.status(200).json({
      message: 'Successfully Loged In',
      user: req.user,
    });
  } else {
    res.status(401).json({ error: true, message: 'Not Authorized' });
  }
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: `http://localhost:3001/`,
    failureRedirect: '/failure',
  })
);

router.post('/file-upload', (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(500).send(error);
    };
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `bucketFolder/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);
      return res.status(200).send(data);
    } catch (err) {
      return res.status(500).send(err);
    }
  });
});

module.exports = router;
