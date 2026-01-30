const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!JWT_SECRET) {
    return res.status(500).send({ status: "error", message: "Server misconfiguration" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ status: "error", message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).send({ status: "error", message: "Token is not valid" });
  }
};

exports.requireRole = (...role) => {
  return (req, res, next) => {
    const roles = Array.isArray(role[0]) ? role[0] : role;
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send({ status: "error", message: "Access denied" });
    }
    next();
  };
};
