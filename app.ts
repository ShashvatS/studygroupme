require('dotenv').config();

import express = require('express');
import http = require('http');
const cors = require('cors');

import path = require('path');

import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
// import cors = require("cors");

import mainRoutes from './routes/main';
import api from "./apis/api";

const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(cors());

import { serveModules } from "./constants";

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(function (_req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, X-Auth-Token");
//     next();
// });

for (let theModule of serveModules) {
    app.use("/" + theModule, express.static(path.join(__dirname, "node_modules", theModule)));
}

app.use(express.static(path.join(__dirname, "public")));
app.use('/', mainRoutes);
app.use('/', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT);
server.listen(app.get('port'), () => { console.log("Listening on port " + process.env.PORT) });