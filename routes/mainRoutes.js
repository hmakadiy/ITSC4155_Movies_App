const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

router.get('/', controller.index);
router.get('/about', controller.about);
router.get('/contact', controller.contact);
router.get('/game', controller.game);
router.get('/dashboard', controller.dashboard);

//Added part
router.get('/showtimes', controller.showtimes)
router.get('/new', controller.new);
router.post('/', controller.create);
router.get('/:id', controller.show);
// router.get('/:id/edit', controller.edit);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.post('/:id/rsvp', controller.editRsvp);
router.delete('/:id/rsvp', controller.deleteRsvp);

module.exports = router;

