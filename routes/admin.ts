import express = require('express');
import path = require('path');

const router = express.Router();

router.get("/fakescrape", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'fakecanvasscrape.html'));
});

export default router;