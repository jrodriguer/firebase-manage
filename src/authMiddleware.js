const { admin } = require("../firebaseAdmin");

const _getAuthToken = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  _getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      console.log({ error: e })
      return res.status(401).send({ error: 'You are not authorized to make this request' });
    }
  });
};

const checkIfAdmin = (req, res, next) => {
  _getAuthToken(req, res, async () => {
    try {
      const userInfo = await admin.auth().verifyIdToken(req.authToken);
      if (userInfo.admin === true) {
        req.authId = userInfo.uid;
        return next();
      }
    } catch (e) {
      console.log({ error: e })
      return res.status(401).send({ error: 'You are not authorized to make this request' });
    }
  });
};

module.exports = { checkIfAuthenticated, checkIfAdmin };