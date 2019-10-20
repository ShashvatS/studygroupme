"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var p = path.join(__dirname, 'name_to_email.json');
var name2email = JSON.parse(fs.readFileSync(p, "utf8"));
exports.default = name2email;
//# sourceMappingURL=name2email.js.map