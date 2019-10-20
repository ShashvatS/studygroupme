import express = require('express');
import google = require('google-auth-library');
import { google as google2 } from 'googleapis';
import share from "../share";
import request = require("request");
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

const calendar = google2.calendar('v3');

const router = express.Router();

const api_key = JSON.parse(process.env.calendar_api_key);
const client = new google.JWT(
    api_key.client_email,
    null,
    api_key.private_key,
    ['https://www.googleapis.com/auth/calendar'],
);

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
    for (let course of data.courses) {
        if (share.courses.has(course)) continue;

        share.courses.add(course);
        share.people[course] = data.people[course];

        let getgroupmeurl = "https://studygroupmeutil.herokuapp.com/" + encodeURIComponent(course);

        request.post(getgroupmeurl, (err, response, body) => {
            if (err) return;
            share.groupme[course] = body.group_link;
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
            share.calendar[course] = event.data.id;
        });
    }

    if (req.body) {
        res.json(req.body);
    }
    else {
        res.json({});
    }
});

router.get('/test2', (req: express.Request, res: express.Response) => {
    calendar.calendarList.list({
        auth: client
    }, (err, list) => {
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


export default router;