import Head from 'next/head';
import EventList from '../components/events/event-list';
import { getFeaturedEvents } from '../helpers/api-util';
// import { getFeaturedEvents } from '../dummy-data';

export default function Homepage(props) {
	const { events } = props;

	return (
		<div>
			<Head>
				<title>NextJs Events</title>
				<meta
					name='description'
					content='Find a lot of great events that allow you to evolve...'
				/>
			</Head>
			<EventList items={events} />
		</div>
	);
}

export async function getStaticProps(context) {
	const featuredEvents = await getFeaturedEvents();

	return {
		props: {
			events: featuredEvents,
		},
		revalidate: 1800,
	};
}
