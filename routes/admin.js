"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var router = express.Router();
router.get("/fakescrape", function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'fakecanvasscrape.html'));
});
exports.default = router;
//# sourceMappingURL=admin.js.map