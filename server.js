// server.js
const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');
const PORT = process.env.PORT || 5000;
const userRouter = require('./db/routes/userRoutes');
const authRouter = require('./db/routes/authRoutes');
const worksRouter = require('./db/routes/worksRoutes');
const pdfRouter = require('./db/routes/pdfRoutes');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', worksRouter);
app.use('/api', pdfRouter);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api`)
})