const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



module.exports = function (req, res, next) {
 console.log(req);
  // let token = req.cookies.token || (req.header("authorization") || "").replace("Bearer", "").trim();
  // if(req.body&&!token){
  //   token = (req.body.headers["Authorization"] || "").replace("Bearer", "").trim()
  // }

  let token = req.cookies?.token;
  console.log('🔐 Incoming Header1:', token);
  // 2) Then try Authorization header
  if(!token && req.body && req.body.headers){
    const [scheme, creds] = req.body.headers["Authorization"].split(' ');
    if (scheme === 'Bearer' && creds) {
      token = creds.trim();
    }
  }
  console.log('🔐 Incoming Header2:', token);
  if (!token && req.headers.authorization) {
    const [scheme, creds] = req.headers.authorization.split(' ');
    if (scheme === 'Bearer' && creds) {
      token = creds.trim();
    }
  }
  
  console.log('🔐 Incoming Header3:', token);

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token Decoded:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
   
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

