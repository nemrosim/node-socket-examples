import express from 'express';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', (request, response) => {
    response.redirect(`/${v4()}`);
});

export default router;
