"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var google = require("google-auth-library");
var googleapis_1 = require("googleapis");
var share_1 = require("../share");
var request = require("request");
var calendar = googleapis_1.google.calendar('v3');
var router = express.Router();
var api_key = JSON.parse(process.env.calendar_api_key);
var client = new google.JWT(api_key.client_email, null, api_key.private_key, ['https://www.googleapis.com/auth/calendar']);
router.post('/register', function (req, res) {
    console.log(req.body);
    if (!req.body.data) {
        res.json({});
        return;
    }
    var data = req.body.data;
    if (!data.username || !data.courses || !data.people) {
        res.json({});
        return;
    }
    share_1.default.users[data.username] = true;
    var _loop_1 = function (course) {
        if (share_1.default.courses.has(course))
            return "continue";
        share_1.default.courses.add(course);
        share_1.default.people[course] = data.people[course];
        var getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(course);
        request.post(getgroupmeurl, function (err, response, body) {
            if (err)
                return;
            share_1.default.groupme[course] = body.group_link;
        });
        calendar.calendars.insert({
            auth: client,
            requestBody: {
                summary: course
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
            share_1.default.calendar[course] = event.data.id;
        });
    };
    for (var _i = 0, _a = data.courses; _i < _a.length; _i++) {
        var course = _a[_i];
        _loop_1(course);
    }
    if (req.body) {
        res.json(req.body);
    }
    else {
        res.json({});
    }
});
router.get('/test2', function (req, res) {
    calendar.calendarList.list({
        auth: client
    }, function (err, list) {
        console.log(list);
    });
    // let event = {
    //     'summary': 'Google I/O 2015',
    //     'location': '800 Howard St., San Francisco, CA 94103',
    //     'description': 'A chance to hear more about Google\'s developer products.',
    //     'start': {
    //       'dateTime': '2015-05-28T09:00:00-07:00',
    //       'timeZone': 'America/Los_Angeles',
    //     },
    //     'end': {
    //       'dateTime': '2015-05-28T17:00:00-07:00',
    //       'timeZone': 'America/Los_Angeles',
    //     },
    //     'recurrence': [
    //       'RRULE:FREQ=DAILY;COUNT=2'
    //     ],
    //     'attendees': [
    //       {'email': 'lpage@example.com'},
    //       {'email': 'sbrin@example.com'},
    //     ],
    //     'reminders': {
    //       'useDefault': false,
    //       'overrides': [
    //         {'method': 'email', 'minutes': 24 * 60},
    //         {'method': 'popup', 'minutes': 10},
    //       ],
    //     },
    //   };
    var event = {
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
});
exports.default = router;
//# sourceMappingURL=api.js.map