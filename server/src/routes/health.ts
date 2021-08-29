import express from 'express';

const router = express.Router();

router.get('/health', (request, response) => {
    response.send('Server is online');
});

export default router;
