const Router = require('express');
const pdfController = require('../controller/pdfController');
// const puppeteer = require('puppeteer');

const router = new Router();
const PdfController = new pdfController();

router.post('/pdf', PdfController.generateWorkPlan.bind(PdfController));

module.exports = router;