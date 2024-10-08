import 'dotenv/config';
import OpenAI from 'openai';
import * as fs from 'fs';

//const openai = new OpenAI(process.env.OPENAI_API_KEY);
const openai = new OpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: 'https://api.groq.com/openai/v1',
});

//const model = 'gpt-4o';
const model = 'llama3-groq-70b-8192-tool-use-preview';

class BlinksService {

	static async selectBlink(prompt) {

		const tools = [
			// memo
			{
				type: 'function',
				function: {
					name: 'addMemo',
					description: 'Adds a memo to the blockchain.',
					parameters: {
						type: 'object',
						properties: {
							message: {
								type: 'string',
								description: 'The message to add to the blockchain.',
							},
							url: {
								type: 'string',
								description: 'The URL to call the function. in this case its https://appapi.lunadefi.ai/blinks/memo',
							},
						},
					},
				},
			},
			// transfer sol
			{
				type: 'function',
				function: {
					name: 'transferSol',
					description: 'Transfers SOL to another Solana wallet.',
					parameters: {
						type: 'object',
						properties: {
							to: {
								type: 'string',
								description: 'The account to transfer to.',
							},
							amount: {
								type: 'number',
								description: 'The amount of SOL to transfer.',
							},
							url: {
								type: 'string',
								description: 'The URL to call the function. in this case its https://appapi.lunadefi.ai/blinks/transfer-sol',
							},
						},
						required: ['to', 'amount', 'url'],
					},
				},
			},
			// swap
			{
				type: 'function',
				function: {
					name: 'swap',
					description: 'Swaps one token for another.',
					parameters: {
						type: 'object',
						properties: {
							from: {
								type: 'string',
								description: 'The token to swap from.',
							},
							to: {
								type: 'string',
								description: 'The token to swap to.',
							},
							amount: {
								type: 'number',
								description: 'The amount of the token to swap.',
							},
							url: {
								type: 'string',
								description: 'The URL to call the function. in this case its https://appapi.lunadefi.ai/blinks/swap',
							},
						},
					},
				},
			},
			// stake bonk, receives amount and number of days
			{
				type: 'function',
				function: {
					name: 'stakeBonk',
					description: 'Stakes BONK for a certain number of days.',
					parameters: {
						type: 'object',
						properties: {
							amount: {
								type: 'number',
								description: 'The amount of BONK to stake.',
							},
							days: {
								type: 'number',
								description: 'The number of days to stake BONK.',
							},
							url: {
								type: 'string',
								description: 'The URL to call the function. in this case its https://appapi.lunadefi.ai/blinks/stake-bonk',
							},
						},
					},
				},
			},
			// conversation
			{
				type: 'function',
				function: {
					name: 'conversation',
					description: 'Have a conversation with Luna.',
					parameters: {
						type: 'object',
						properties: {
							prompt: {
								type: 'string',
								description: 'The exact prompt sent by the user.',
							},
						},
					},
				},
			},
		];

		const messages = [
			{
				role: 'system',
				content: 'You are Luna, a Solana crypto assistant. ' +
					'Your main job is to help users find the best Solana actions for their needs. ' +
					'You have access to the following tools: memo, transfer sol, swap, and stake bonk. ' +
					'If no method is selected, you should have a conversation with the user.',
			},
			{ role: 'user', content: prompt },
		];

		const response = await openai.chat.completions.create({
			model: model,
			messages: messages,
			tools: tools,
			tool_choice: 'required',
		});

		const selectedFunction = response.choices[0].message.tool_calls[0].function;
		console.log(selectedFunction);

		const selectedFunctionArgs = JSON.parse(selectedFunction.arguments);
		const dialectLink = `https://dial.to/?action=solana-action:${ selectedFunctionArgs.url }`;

		const conversationPrompt = 'You are Luna, a Solana crypto assistant. ' +
			'Your personality is funny but professional, a little sassy maybe.' +
			'You always answer in the user\'s language, and you are always helpful. ' +
			'Your main job is to help the user with blinks. ';

		const blinkSystemPrompt = 'Offer the user the link to the blink and an explanation on how to use it.' +
			'This is the link you should offer: ' + dialectLink +
			'These are the args to consider: ' + selectedFunction.arguments;

		const messages2 = [
			{
				role: 'system',
				content: selectedFunction.name === 'conversation' ? conversationPrompt : blinkSystemPrompt,
			},
		];

		if(selectedFunction.name === 'conversation') {
			messages2.push({ role: 'user', content: prompt });
		}

		const response2 = await openai.chat.completions.create({
			model: model,
			messages: messages2,
		});

		// write the response to a .md file inside /responses folder
		fs.writeFileSync(`./responses/${ selectedFunction.name }-${ Date.now() }.md`, response2.choices[0].message.content);

		return response2.choices[0].message.content;
	}
}

export default BlinksService;