import express from 'express';
import { v4 } from 'uuid';

const router = express.Router();

router.get('/', (request, response) => {
    response.redirect(`/${v4()}`);
});
router.get('/health', (request, response) => {
    response.send(JSON.stringify(process.env));
});

export default router;
