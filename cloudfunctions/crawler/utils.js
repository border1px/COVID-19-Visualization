function match(string, reg) {
  const result = string.match(reg);
  if (result && result.length > 1) {
      return result[1];
  } else {
      return null;
  }
}

module.exports.match = match