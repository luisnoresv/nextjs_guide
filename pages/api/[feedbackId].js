import { buildFeedbackPath, extractFeedback } from './feedback';

export default function handler(req, res) {
	if (req.method === 'DELETE') {
		// some code for DELETE
	}

	const feedbackId = req.query.feedbackId;

	const filePath = buildFeedbackPath();
	const feedbackData = extractFeedback(filePath);
	const selectedFeedback = feedbackData.find(
		(feedback) => feedback.id === feedbackId
	);

	res.status(200).json({ feedback: selectedFeedback });
}
