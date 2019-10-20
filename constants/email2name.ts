import fs = require('fs');
import path = require('path');

const p = path.join(__dirname, 'email_to_name.json');
const email2name = JSON.parse(fs.readFileSync(p, "utf8"));

export default email2name;