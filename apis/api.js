"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.post('/register', function (req, res) {
    console.log(req.body);
    if (req.body) {
        res.json(req.body);
    }
    else {
        res.json({});
    }
});
exports.default = router;
//# sourceMappingURL=api.js.map