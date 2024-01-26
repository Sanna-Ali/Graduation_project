const jwt = require('jsonwebtoken')
// Generate Auth Token
const generateAuthToken = function (user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "20d",
      }
    );
  };


  // GeneraterefreshToken
  const generaterefreshToken = function (user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_REF,
      {
        expiresIn: "20d",
      }
    );
  };
  

module.exports = {
  generateAuthToken,
  generaterefreshToken
}
  