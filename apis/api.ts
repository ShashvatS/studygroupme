import express = require('express');

const router = express.Router();

router.post('/register', (req: express.Request, res: express.Response) => {
    console.log(req.body.data);
});

export default router;