"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var share_1 = require("../share");
var router = express.Router();
// router.get('/*', (req: express.Request, res: express.Response, next) => {
//     res.cookie("testing cookie", "hello world");
//     next();
// });
// router.get('/', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '..', "views", "index.html"));
// });
// bad: what if file does not exist
// router.get('/scripts/:file', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '..', "views", "scripts", req.params.file));
// });
// router.post('/*', (req: express.Request, res: express.Response, next) => {
//     console.log(req);
//     next();
// });
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
router.get('/login', function (req, res) {
    // console.log(req.originalUrl);
    // console.log(req.query.url);
    // res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
    if (req.query.url == null) {
        req.query.url = "/";
    }
    var url = "/login?url=" + encodeURIComponent(req.query.url);
    res.render('login', { url: url });
});
router.post('/login', function (req, res) {
    console.log("I am over here!\n");
    if (req.body.username) {
        res.cookie("username", req.body.username, { maxAge: 900000, httpOnly: true });
        if (req.query.url)
            res.redirect(req.query.url);
        else
            res.redirect("/");
    }
    else {
        res.redirect(req.url);
    }
});
router.get('/register', function (req, res) {
    if (req.query.url == null) {
        req.query.url = "/";
    }
    res.render('register', { username: req.cookies.username, url: req.query.url });
});
router.get('*', function (req, res, next) {
    if (req.cookies.username) {
        next();
    }
    else {
        var string = encodeURIComponent(req.url);
        res.redirect('/login?url=' + string);
    }
});
router.get('*', function (req, res, next) {
    if (req.cookies.registered) {
        next();
    }
    else if (share_1.default.users[req.cookies.username] != null) {
        res.cookie("registered", true, { maxAge: 900000, httpOnly: true });
        next();
    }
    else {
        var string = encodeURIComponent(req.url);
        res.redirect('/register?url=' + string);
    }
});
router.get("/endpoint", function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'endpoint.html'));
});
router.post('/test', function (req, res) {
    console.log(req.body);
    res.json({
        res: true
    });
});
exports.default = router;
//# sourceMappingURL=main.js.map