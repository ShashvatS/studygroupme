import express = require('express');

const router = express.Router();

router.post('/register', (req: express.Request, res: express.Response) => {
    console.log(req);
    
    if (req.body) {
        res.json(req.body);
    }
    else {
        res.json({});
    }    
});

export default router;