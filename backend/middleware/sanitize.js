// Strips MongoDB query operators ($gt, $ne, $where, etc.) and dotted keys
// out of anything a client sends. Without this, a crafted request like
// { "email": { "$ne": null }, "password": { "$ne": null } } could trick
// User.findOne({ email }) into matching any user and skipping the real
// password check entirely - a classic NoSQL injection.
//
// This mutates objects IN PLACE (never reassigns req.body/req.query) so it
// works safely on Express 5, where req.query is a read-only getter.

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    value.forEach((item) => sanitizeValue(item));
    return;
  }

  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete value[key];
      } else {
        sanitizeValue(value[key]);
      }
    }
  }
}

const sanitizeRequest = (req, res, next) => {
  sanitizeValue(req.body);
  sanitizeValue(req.query);
  sanitizeValue(req.params);
  next();
};

module.exports = sanitizeRequest;
