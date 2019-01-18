const tokens = [];

module.exports = {
  add(token, payload) {
    tokens[token] = payload;
  },

  isValid(token) {
    if (!tokens[token]) {
      return false;
    }

    if (tokens[token].exp <= new Date()) {
      const index = tokens.indexOf(token);
      tokens.splice(index, 1);
      return false;
    } else {
      return true;
    }
  },

  removeAll(email) {
    for (const token in tokens) {
      if (tokens[token].email === email) {
        delete tokens[token];
      }
    }
  }
};
