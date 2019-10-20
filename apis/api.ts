import express = require('express');

const router = express.Router();

router.post('/register', (req: express.Request, res: express.Response) => {
    console.log(req.body);
    
    res.send("hello world!");
});

export default router;