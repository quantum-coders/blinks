class BlinksController {

	static getActions(req, res) {
		const actions = {
			rules: [
				{
					pathPattern: '/memo',
					apiPath: '/memo',
				},
				{
					pathPattern: '/transfer-sol',
					apiPath: '/transfer-sol',
				},
			],
		};

		res.json(actions);
	}

	static memo(req, res) {
		const memo = {
			title: 'Add Memo',
			icon: 'https://app.lunadefi.ai/blinks-image.jpg',
			description: 'Add a memo to the blockchain.',
			label: 'Add Memo',
			links: {
				actions: [
					{
						label: 'Add Memo',
						href: '/blinks/memo?message={message}',
						parameters: [
							{
								label: 'Message',
								name: 'message',
								required: true,
							},
						],
					},
				],
			},
		};

		res.json(memo);
	}

	static transferSol(req, res) {
		const transferSol = {
			title: 'Transfer Native SOL',
			icon: 'https://app.lunadefi.ai/blinks-image.jpg',
			description: 'Transfer SOL to another Solana wallet',
			links: {
				actions: [
					{
						label: 'Transfer SOL',
						href: '/blinks/transfer-sol?to={to}&amount={amount}',
						parameters: [
							{
								label: 'Account to transfer to',
								name: 'to',
								required: true,
							},
							{
								label: 'Amount of SOL to transfer',
								name: 'amount',
								required: true,
							},
						],
					},
				],
			},
		};

		res.json(transferSol);
	}

	// Handle

	static handleMemo(req, res) {
		res.json({
			transaction: '0x1234567890',
			message: 'Memo added successfully',
		});
	}

	static handleTransferSol(req, res) {
		res.json({
			transaction: '0x1234567890',
			message: 'Memo added successfully',
		});
	}
}

export default BlinksController;