const express = require('express');
const router = express.Router();

const controller = require('./roomController');

router.get('/', controller.getRooms);
router.get('/:roomId', controller.getRoom);
router.post('/', controller.postRoom);
router.put('/', controller.putRoom);
router.delete('/:roomId', controller.deleteRoom);

module.exports = router;