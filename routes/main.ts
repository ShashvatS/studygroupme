import express = require('express');
import path = require('path');
import share from "../share";

const router = express.Router();

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

router.get('/scrapecanvas.js', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'scrapecanvas.js'));
});

router.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/login', (req: express.Request, res: express.Response) => {
    // console.log(req.originalUrl);
    // console.log(req.query.url);
    // res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
    if (req.query.url == null) {
        req.query.url = "/";
    }

    let url = "/login?url=" + encodeURIComponent(req.query.url);

    res.render('login', { url: url });
});

router.post('/login', (req: express.Request, res: express.Response) => {
    console.log("I am over here!\n");
    if (req.body.username) {
        res.cookie("username", req.body.username, { maxAge: 900000, httpOnly: true });
        if (req.query.url) res.redirect(req.query.url);
        else res.redirect("/");
    }
    else {
        res.redirect(req.url);
    }
});

router.get('/register', (req: express.Request, res: express.Response) => {
    if (req.query.url == null) {
        req.query.url = "/";
    }

    res.render('register', { username: req.cookies.username, url: req.query.url });
});

router.get('*', (req: express.Request, res: express.Response, next) => {
    if (req.cookies.username) {
        next();
    } else {
        let string = encodeURIComponent(req.url);
        res.redirect('/login?url=' + string);
    }
});

router.get('*', (req: express.Request, res: express.Response, next) => {
    if (req.cookies.registered) {
        next();
    } else if (share.users[req.cookies.username] != null) {
        res.cookie("registered", true, { maxAge: 900000, httpOnly: true });
        next();
    } else {
        let string = encodeURIComponent(req.url);
        res.redirect('/register?url=' + string);
    }
});

router.get("/endpoint", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'endpoint.html'));
});

router.post('/test', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    res.json({
        res: true
    });
});

router.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'main.html'));
});

router.get('/groups', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'mygroups.html'));
});


export default router;