import fs = require('fs');
import path = require('path');

const p = path.join(__dirname, 'name_to_email.json');
const name2email = JSON.parse(fs.readFileSync(p, "utf8"));

export default name2email;