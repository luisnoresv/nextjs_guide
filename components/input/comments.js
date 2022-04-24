import { useContext, useEffect, useState } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments(props) {
	const { eventId } = props;

	const notificationContext = useContext(NotificationContext);

	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState([]);
	const [isFetchingComments, setIsFetchingComments] = useState(false);

	useEffect(() => {
		if (showComments) {
			setIsFetchingComments(true);
			fetch(`/api/comments/${eventId}`)
				.then((response) => response.json())
				.then((data) => {
					setComments(data.comments);
					setIsFetchingComments(false);
				});
		}
	}, [eventId, showComments]);

	function toggleCommentsHandler() {
		setShowComments((prevStatus) => !prevStatus);
	}

	function addCommentHandler(commentData) {
		notificationContext.showNotification({
			title: 'Sending comment...',
			message: 'Your comment is currently being sorted into a database',
			status: 'pending',
		});
		// send data to API
		fetch(`/api/comments/${eventId}`, {
			method: 'POST',
			body: JSON.stringify(commentData),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				if (response) {
					return response.json();
				}

				return response.json().then((data) => {
					throw new Error(data.message || 'Something went wrong');
				});
			})
			.then((data) => {
				notificationContext.showNotification({
					title: 'Success!',
					message: 'Your comment was saved!',
					status: 'success',
				});
			})
			.catch((error) => {
				notificationContext.showNotification({
					title: 'Error!',
					message: error.message || 'Something went wrong!',
					status: 'error',
				});
			});
	}

	return (
		<section className={classes.comments}>
			<button onClick={toggleCommentsHandler}>
				{showComments ? 'Hide' : 'Show'} Comments
			</button>
			{showComments && <NewComment onAddComment={addCommentHandler} />}
			{showComments && !isFetchingComments && <CommentList items={comments} />}
			{showComments && isFetchingComments && <p>Loading...</p>}
		</section>
	);
}

export default Comments;
