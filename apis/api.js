"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.post('/register', function (req, res) {
    console.log(req.body.data);
});
exports.default = router;
//# sourceMappingURL=api.js.map