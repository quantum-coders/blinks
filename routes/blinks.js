import { getRouter } from '@thewebchimp/primate';
import BlinksController from '../controllers/blinks.controller.js';
const router = getRouter();

router.get('/', (req, res) => {
	res.respond({
		data: {
			message: 'Blinks Boilerplate is up and running! 🚀',
		},
	});
});

router.get('/actions.json', BlinksController.getActions);

router.get('/memo', BlinksController.memo);
router.post('/blinks/memo', BlinksController.handleMemo);

router.get('/transfer-sol', BlinksController.transferSol);
router.post('/blinks/transfer-sol', BlinksController.handleTransferSol);

export { router };