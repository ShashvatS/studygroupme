"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
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
//bad: what if file does not exist
// router.get('/scripts/:file', (req: express.Request, res: express.Response) => {
//     res.sendFile(path.join(__dirname, '..', "views", "scripts", req.params.file));
// });
// router.post('/*', (req: express.Request, res: express.Response, next) => {
//     console.log(req);
//     next();
// });
// const api_key = JSON.parse(process.env.calendar_api_key);
// const client = new google.JWT(
//     api_key.client_email,
//     null,
//     api_key.private_key,
//     ['https://www.googleapis.com/auth/calendar'],
// );
// router.get('/test2', async (req: express.Request, res: express.Response) => {
//     const apires = await calendar.calendarList.list({
//         auth: client
//     });
//     // let event = {
//     //     'summary': 'Google I/O 2015',
//     //     'location': '800 Howard St., San Francisco, CA 94103',
//     //     'description': 'A chance to hear more about Google\'s developer products.',
//     //     'start': {
//     //       'dateTime': '2015-05-28T09:00:00-07:00',
//     //       'timeZone': 'America/Los_Angeles',
//     //     },
//     //     'end': {
//     //       'dateTime': '2015-05-28T17:00:00-07:00',
//     //       'timeZone': 'America/Los_Angeles',
//     //     },
//     //     'recurrence': [
//     //       'RRULE:FREQ=DAILY;COUNT=2'
//     //     ],
//     //     'attendees': [
//     //       {'email': 'lpage@example.com'},
//     //       {'email': 'sbrin@example.com'},
//     //     ],
//     //     'reminders': {
//     //       'useDefault': false,
//     //       'overrides': [
//     //         {'method': 'email', 'minutes': 24 * 60},
//     //         {'method': 'popup', 'minutes': 10},
//     //       ],
//     //     },
//     //   };
//     let event = {
//         'start': {
//             'dateTime': '2019-10-28T09:00:00-07:00',
//             'timeZone': 'America/Los_Angeles',
//         },
//         'end': {
//             'dateTime': '2019-10-28T17:00:00-07:00',
//             'timeZone': 'America/Los_Angeles',
//         },
//         'htmlLink': "https://google.com"
//     };
//     calendar.events.insert({
//         auth: client,
//         calendarId: 'studygroupme@gmail.com',
//         requestBody: event
//     }, function (err, event) {
//         if (err) {
//             console.log('There was an error contacting the Calendar service: ' + err);
//             return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//     });
//     calendar.calendars.insert({
//         auth: client,
//         requestBody: {
//             summary: "randomtest"
//         },
//     }, function (err, event) {
//         if (err) {
//             console.log('There was an error contacting the Calendar service: ' + err);
//             return;
//         }
//         calendar.acl.insert({
//             auth: client,
//             calendarId: event.data.id,
//             requestBody: {
//                 "scope": {
//                     "type": "default"
//                 },
//                 "role": "reader"
//             }
//         });
//         console.log(event.data.id);
//         console.log('calendar created: %s', event);
//     });
//     res.json({
//         res: true
//     });
// });
router.post('/test', function (req, res) {
    console.log(req.body);
    res.json({
        res: true
    });
});
exports.default = router;
//# sourceMappingURL=main.js.map