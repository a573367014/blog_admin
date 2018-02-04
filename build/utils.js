const path = require('path');
module.exports = {
   resolve (_path) {
      return path.join(__dirname, '../', _path);
   }
};
