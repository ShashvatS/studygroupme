import express = require('express');
import google = require('google-auth-library');
import { google as google2 } from 'googleapis';
import share from "../share";
import request = require("request");
import name2email from "../constants/name2email";
import { switchStatement, functionTypeParam } from 'babel-types';

const calendar = google2.calendar('v3');

const router = express.Router();

const api_key = JSON.parse(process.env.calendar_api_key);
const client = new google.JWT(
    api_key.client_email,
    null,
    api_key.private_key,
    ['https://www.googleapis.com/auth/calendar'],
);

let calendar_list = [];
let calendar_idx = 0;
calendar.calendarList.list({
    auth: client
}, (err, list) => {
    for (let item of list.data.items) {
        calendar_list.push(item.id);
    }

    // console.log(calendar_list);
});

router.post('/register', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    if (!req.body.data) {
        res.json({});
        return;
    }
    const data = req.body.data;

    if (!data.username || !data.courses || !data.people) {
        res.json({});
        return;
    }

    share.users[data.username] = true;
    share.user_courses[data.username] = data.courses;
    share.user_groups[data.username] = [];

    for (let course of data.courses) {
        if (share.courses.has(course)) continue;

        share.courses.add(course);

        share.people[course] = data.people[course];
        share.users[course] = data.people[course].map(person => name2email[person]);

        let getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(course);

        request.post(getgroupmeurl, (err, response, body) => {
            if (err) return;
            let x = JSON.parse(body);
            share.groupme[course] = x.group_link;
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

        share.calendar[course] = calendar_list[calendar_idx];
        calendar_idx = (calendar_idx + 1) % calendar_list.length;
    }

    if (req.body) {
        res.json(req.body);
    }
    else {
        res.json({});
    }
});

router.get('/userdata', (req: express.Request, res: express.Response) => {
    const data = {
        courses: [],
        group_links: {},
        calendar_links: {}
    };

    let user = req.cookies.username;

    if (!user) {
        res.json({});
        return;
    }

    data.courses = share.user_courses[user];
    for (let course of data.courses) {
        data.group_links[course] = share.groupme[course];
        data.calendar_links[course] = share.calendar[course];
    }

    res.json(data);
});

router.post('/createevent', (req: express.Request, res: express.Response) => {
    const new_group = {
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

    const idx = share.study_groups.length;

    let url = process.env.url + "/join/" + encodeURIComponent(idx);

    let event = {
        'start': {
            'dateTime': req.body.data.start,
            'timeZone': 'America/New_York',
        },
        'end': {
            'dateTime': req.body.data.end,
            'timeZone': 'America/New_York',
        },
        'description': `Purpose: ${req.body.data.purpose} <br> Size: 1/${req.body.data.max} <br> <a href=${url}>Join</a>`,
        location: new_group.location
    };

    new_group.orig_event = event;

    calendar.events.insert({
        auth: client,
        calendarId: share.calendar[new_group.course],
        requestBody: event
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }

        share.study_groups[idx].eventId = event.data.id;
        console.log(event);
    });


    share.study_groups.push(new_group);
    let getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(idx);
    request.post(getgroupmeurl, (err, response, body) => {
        if (err) return;
        let x = JSON.parse(body);
        share.study_groups[idx].group_link = x.group_link;
    });

});

router.get('/join/:idx', (req: express.Request, res: express.Response) => {
    const idx = req.params.idx;

    share.study_groups[idx].users.push(req.cookies.username);
    let group = share.study_groups[idx];

    const event = group.orig_event;


    let url = process.env.url + "/join/" + encodeURIComponent(idx);
    event.description = `Purpose: ${group.original_data.purpose} <br> Size: ${group.users.length}/${group.original_data.max} <br> <a href="${url}">Join</a>`

    calendar.events.update({
        auth: client,
        calendarId: share.calendar[group.course],
        eventId: group.eventId,
        requestBody: event
    }, (err, event) => {
        console.log(err);
        console.log(err);
    });

    res.send("close this, ye hath joined");

});

router.get('/test2', (req: express.Request, res: express.Response) => {
    calendar.calendarList.list({
        auth: client
    }, (err, list) => {
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

    let event = {
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

router.get('/all', (req: express.Request, res: express.Response) => {
    res.json(share.study_groups);
});

export default router;