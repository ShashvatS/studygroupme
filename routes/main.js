"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var google = require("google-auth-library");
var googleapis_1 = require("googleapis");
var calendar = googleapis_1.google.calendar('v3');
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
var api_key = JSON.parse(process.env.calendar_api_key);
var client = new google.JWT(api_key.client_email, null, api_key.private_key, ['https://www.googleapis.com/auth/calendar']);
router.get('/test2', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event;
    return __generator(this, function (_a) {
        calendar.calendarList.list({
            auth: client
        }, function (err, list) {
            console.log(list);
        });
        event = {
            'start': {
                'dateTime': '2019-10-28T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'end': {
                'dateTime': '2019-10-28T17:00:00-07:00',
                'timeZone': 'America/Los_Angeles',
            },
            'htmlLink': "https://google.com"
        };
        calendar.events.insert({
            auth: client,
            calendarId: 'studygroupme@gmail.com',
            requestBody: event
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
        });
        calendar.calendars.insert({
            auth: client,
            requestBody: {
                summary: "randomtest"
            },
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            calendar.acl.insert({
                auth: client,
                calendarId: event.data.id,
                requestBody: {
                    "scope": {
                        "type": "default"
                    },
                    "role": "reader"
                }
            });
            console.log(event.data.id);
            console.log('calendar created: %s', event);
        });
        res.json({
            res: true
        });
        return [2 /*return*/];
    });
}); });
router.post('/test', function (req, res) {
    console.log(req.body);
    res.json({
        res: true
    });
});
exports.default = router;
//# sourceMappingURL=main.js.map