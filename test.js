import BlinksService from './services/blinks.service.js';
import readline from 'readline';

// Set up readline interface to get input from the console
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Ask for user input
rl.question('What do you want to say to Luna? ', async function(userPrompt) {
	try {
		// Use the user input as the prompt for BlinksService
		const blink = await BlinksService.selectBlink(userPrompt);

		// Output the result
		console.log(blink);
	} catch(error) {
		console.error('Error:', error);
	} finally {
		// Close the readline interface
		rl.close();
	}
});