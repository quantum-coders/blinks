import primate from '@thewebchimp/primate';
import { router as blinks } from './routes/blinks.js';

await primate.start();

primate.app.use('/', blinks);