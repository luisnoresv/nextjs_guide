import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { getFilteredEvents } from '../../helpers/api-util';

export default function FilteredEventsPage(props) {
	const [loadedEvents, setLoadedEvents] = useState([]);
	const router = useRouter();

	const filterData = router.query.slug;

	const fetcher = (...args) => fetch(...args).then((res) => res.json());
	const { data, error } = useSWR(
		'https://nextj-course-default-rtdb.firebaseio.com/events.json',
		fetcher
	);

	useEffect(() => {
		if (data) {
			const events = [];

			for (const key in data) {
				events.push({
					id: key,
					...data[key],
				});
			}

			setLoadedEvents(events);
		}
	}, [data]);

	if (!loadedEvents) return <p className='center'>Loading...</p>;

	const filteredYear = filterData[0];
	const filterdMonth = filterData[1];

	const numYear = +filteredYear;
	const numMonth = +filterdMonth;

	if (
		isNaN(numYear) ||
		isNaN(numMonth) ||
		numYear > 2030 ||
		numYear < 2021 ||
		numMonth < 1 ||
		numMonth > 12 ||
		error
	) {
		return (
			<>
				<ErrorAlert>
					<p>Invalid filter. Please adjust your values!</p>
				</ErrorAlert>
				<div className='center'>
					<Button link='/events'>Show All Events</Button>
				</div>
			</>
		);
	}

	const filteredEvents = loadedEvents.filter((event) => {
		const eventDate = new Date(event.date);
		return (
			eventDate.getFullYear() === numYear &&
			eventDate.getMonth() === numMonth - 1
		);
	});

	if (!filteredEvents || filteredEvents.length === 0) {
		return (
			<>
				<ErrorAlert>
					<p>Invalid filter, please adjust your values!</p>
				</ErrorAlert>
				<div className='center' style={{ textAlign: 'center' }}>
					<Button link='/events'>Show all Events</Button>
				</div>
			</>
		);
	}

	const date = new Date(numYear, numMonth - 1);

	return (
		<>
			<ResultsTitle date={date} />
			<EventList items={filteredEvents} />
		</>
	);
}

// export async function getServerSideProps(context) {
// 	const { params } = context;

// 	const filteredData = params.slug;

// 	const filteredYear = filteredData[0];
// 	const filterdMonth = filteredData[1];

// 	const numYear = +filteredYear;
// 	const numMonth = +filterdMonth;

// 	if (
// 		isNaN(numYear) ||
// 		isNaN(numMonth) ||
// 		numYear > 2030 ||
// 		numYear < 2021 ||
// 		numMonth < 1 ||
// 		numMonth > 12
// 	) {
// 		return {
// 			props: {
// 				hasError: true,
// 			},
// 		};
// 	}

// 	const filteredEvents = await getFilteredEvents({
// 		year: numYear,
// 		month: numMonth,
// 	});

// 	return {
// 		props: {
// 			events: filteredEvents,
// 			date: {
// 				year: numYear,
// 				month: numMonth,
// 			},
// 		},
// 	};
// }
