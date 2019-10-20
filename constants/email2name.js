"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var p = path.join(__dirname, 'email_to_name.json');
var email2name = JSON.parse(fs.readFileSync(p, "utf8"));
exports.default = email2name;
//# sourceMappingURL=email2name.js.map