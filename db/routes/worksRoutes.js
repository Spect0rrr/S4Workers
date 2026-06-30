const Router = require('express');
const WorksController = require('../controller/worksController');

const router = new Router();
const worksController = new WorksController();

router.post('/works', worksController.addWorks.bind(worksController));
router.get('/works/select_content', (req, res) => worksController.getContentForSelect(req, res));
router.get('/works/select_subcontent', (req, res) => worksController.getSubcontentForSelect(req, res));
router.get('/works/select_content_update', (req, res) => worksController.getUpdatedSubcontent(req, res));
router.delete('/works/delete_works', worksController.deleteWorks.bind(worksController));
router.post('/works/enter_works_select', worksController.addEnterWorks.bind(worksController));

module.exports = router;