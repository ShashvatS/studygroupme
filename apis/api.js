"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var google = require("google-auth-library");
var googleapis_1 = require("googleapis");
var share_1 = require("../share");
var request = require("request");
var name2email_1 = require("../constants/name2email");
var calendar = googleapis_1.google.calendar('v3');
var router = express.Router();
var api_key = JSON.parse(process.env.calendar_api_key);
var client = new google.JWT(api_key.client_email, null, api_key.private_key, ['https://www.googleapis.com/auth/calendar']);
var calendar_list = [];
var calendar_idx = 0;
calendar.calendarList.list({
    auth: client
}, function (err, list) {
    for (var _i = 0, _a = list.data.items; _i < _a.length; _i++) {
        var item = _a[_i];
        calendar_list.push(item.id);
    }
    // console.log(calendar_list);
});
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
    share_1.default.user_courses[data.username] = data.courses;
    share_1.default.user_groups[data.username] = [];
    var _loop_1 = function (course) {
        if (share_1.default.courses.has(course))
            return "continue";
        share_1.default.courses.add(course);
        share_1.default.people[course] = data.people[course];
        share_1.default.users[course] = data.people[course].map(function (person) { return name2email_1.default[person]; });
        var getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(course);
        request.post(getgroupmeurl, function (err, response, body) {
            if (err)
                return;
            var x = JSON.parse(body);
            share_1.default.groupme[course] = x.group_link;
        });
        // created too many calendars, oops
        // calendar.calendars.insert({
        //     auth: client,
        //     requestBody: {
        //         summary: course
        //     },
        // }, function (err, event) {
        //     if (err) {
        //         console.log('There was an error contacting the Calendar service: ' + err);
        //         return;
        //     }
        //     calendar.acl.insert({
        //         auth: client,
        //         calendarId: event.data.id,
        //         requestBody: {
        //             "scope": {
        //                 "type": "default"
        //             },
        //             "role": "reader"
        //         }
        //     });
        //     console.log(event.data.id);
        //     console.log('calendar created: %s', event);
        //     share.calendar[course] = event.data.id;
        // });
        calendar.acl.insert({
            auth: client,
            calendarId: calendar_list[calendar_idx],
            requestBody: {
                "scope": {
                    "type": "default"
                },
                "role": "reader"
            }
        });
        share_1.default.calendar[course] = calendar_list[calendar_idx];
        calendar_idx = (calendar_idx + 1) % calendar_list.length;
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
router.get('/userdata', function (req, res) {
    var data = {
        courses: [],
        group_links: {},
        calendar_links: {}
    };
    var user = req.cookies.username;
    if (!user) {
        res.json({});
        return;
    }
    data.courses = share_1.default.user_courses[user];
    for (var _i = 0, _a = data.courses; _i < _a.length; _i++) {
        var course = _a[_i];
        data.group_links[course] = share_1.default.groupme[course];
        data.calendar_links[course] = share_1.default.calendar[course];
    }
    res.json(data);
});
router.post('/createevent', function (req, res) {
    var new_group = {
        users: [],
        limit: 0,
        course: null,
        group_link: "",
        location: "",
        eventId: null,
        original_data: req.body.data,
        orig_event: null
    };
    new_group.users = [req.cookies.username];
    new_group.limit = req.body.data.limit;
    new_group.course = req.body.data.course;
    new_group.location = req.body.data.location;
    var idx = share_1.default.study_groups.length;
    var url = process.env.url + "/join/" + encodeURIComponent(idx);
    var event = {
        'start': {
            'dateTime': req.body.data.start,
            'timeZone': 'America/New_York',
        },
        'end': {
            'dateTime': req.body.data.end,
            'timeZone': 'America/New_York',
        },
        'description': "Purpose: " + req.body.data.purpose + " <br> Size: 1/" + req.body.data.max + " <br> <a href=" + url + ">Join</a>",
        location: new_group.location
    };
    new_group.orig_event = event;
    calendar.events.insert({
        auth: client,
        calendarId: share_1.default.calendar[new_group.course],
        requestBody: event
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        share_1.default.study_groups[idx].eventId = event.data.id;
        console.log(event);
    });
    share_1.default.study_groups.push(new_group);
    var getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(idx);
    request.post(getgroupmeurl, function (err, response, body) {
        if (err)
            return;
        var x = JSON.parse(body);
        share_1.default.study_groups[idx].group_link = x.group_link;
    });
});
router.get('/join/:idx', function (req, res) {
    var idx = req.params.idx;
    share_1.default.study_groups[idx].users.push(req.cookies.username);
    var group = share_1.default.study_groups[idx];
    var event = group.orig_event;
    var url = process.env.url + "/join/" + encodeURIComponent(idx);
    event.description = "Purpose: " + group.original_data.purpose + " <br> Size: " + group.users.length + "/" + group.original_data.max + " <br> <a href=\"" + url + "\">Join</a>";
    calendar.events.update({
        auth: client,
        calendarId: share_1.default.calendar[group.course],
        eventId: group.eventId,
        requestBody: event
    }, function (err, event) {
        console.log(err);
        console.log(err);
    });
    res.send("close this, ye hath joined");
});
router.get('/test2', function (req, res) {
    calendar.calendarList.list({
        auth: client
    }, function (err, list) {
        console.log(list);
        console.log(list.data.items[0]);
        // calendar.calendars.delete({
        //     auth: client,
        //     calendarId: list.data.items[0].id
        // }, (err, event) => {
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
        // });
    });
    // let event = {
    //     'summary': 'Google I/O 2015',
    //     'location': '800 Howard St., San Francisco, CA 94103',
    //     'description': 'A chance to hear more about Google\'s developer products.',
    //     'start': {
    //       'dateTime': '2019-10-20T10:00:00-07:00',
    //       'timeZone': 'America/Los_Angeles',
    //     },
    //     'end': {
    //       'dateTime': '2019-10-28T11:00:00-07:00',
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
    // calendar.events.insert({
    //     auth: client,
    //     calendarId: 'studygroupme@gmail.com',
    //     requestBody: event
    // }, function (err, event) {
    //     if (err) {
    //         console.log('There was an error contacting the Calendar service: ' + err);
    //         return;
    //     }
    //     console.log('Event created: %s', event.htmlLink);
    // });
    // calendar.calendars.insert({
    //     auth: client,
    //     requestBody: {
    //         summary: "randomtest"
    //     },
    // }, function (err, event) {
    //     if (err) {
    //         console.log('There was an error contacting the Calendar service: ' + err);
    //         return;
    //     }
    //     calendar.acl.insert({
    //         auth: client,
    //         calendarId: event.data.id,
    //         requestBody: {
    //             "scope": {
    //                 "type": "default"
    //             },
    //             "role": "reader"
    //         }
    //     });
    //     console.log(event.data.id);
    //     console.log('calendar created: %s', event);
    // });
    res.json({
        res: true
    });
});
exports.default = router;
//# sourceMappingURL=api.js.map