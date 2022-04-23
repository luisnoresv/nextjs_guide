// /api/comments/some-event-id
import {
	connectDatabase,
	getAllDocuments,
	insertDocument,
} from '../../../helpers/db-util';

export default async function handler(req, res) {
	const eventId = req.query.eventId;

	let client;

	try {
		client = await connectDatabase();
	} catch (error) {
		res.status(500).json({ message: 'Database connection failed' });
		return;
	}

	if (req.method === 'POST') {
		const { email, name, text } = req.body;

		if (
			!email.includes('@') ||
			!name ||
			!name.trim() === '' ||
			!text ||
			!text.trim() === ''
		) {
			res.status(422).json({ message: 'Invalid input.' });
			return;
		}

		const newComment = {
			email,
			name,
			text,
			eventId,
		};

		try {
			const result = await insertDocument(client, 'comments', newComment);
			newComment._id = result.insertedId;
			res.status(201).json({ message: 'Added comment', comment: newComment });
		} catch (error) {
			res.status(404).json({ message: 'Inserting comment failed!!' });
		}
	} else if (req.method === 'GET') {
		try {
			const comments = await getAllDocuments(
				client,
				'comments',
				{ _id: -1 },
				{ eventId: eventId }
			);
			res.status(200).json({ comments });
		} catch (error) {
			res.status(400).json({ message: 'Getting comments failed' });
		}
	}
	client.close();
}
