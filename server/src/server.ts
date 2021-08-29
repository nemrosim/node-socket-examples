import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health';

const app = express();
app.use(cors());

app.use(healthRoute);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
