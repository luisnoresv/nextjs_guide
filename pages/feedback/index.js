import { useState } from 'react';

import { buildFeedbackPath, extractFeedback } from '../api/feedback';

export default function FeedbackPage(props) {
	const { feedbackItems } = props;
	const [feedbackData, setFeedbackData] = useState();

	const loadFeedbackHandler = (id) => {
		console.info(id);
		fetch(`/api/${id}`)
			.then((response) => response.json())
			.then((data) => {
				setFeedbackData(data.feedback);
			});
	};

	return (
		<>
			{feedbackData && <p>{feedbackData.email}</p>}
			<ul>
				{feedbackItems.map((item) => (
					<li key={item.id}>
						{item.text}{' '}
						<button onClick={() => loadFeedbackHandler(item.id)}>
							Show Details
						</button>
					</li>
				))}
			</ul>
		</>
	);
}

export async function getStaticProps() {
	const filePath = buildFeedbackPath();
	const data = extractFeedback(filePath);

	return {
		props: { feedbackItems: data },
	};
}
