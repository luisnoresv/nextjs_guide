import { useRouter } from 'next/router';

export default function PortfolioProjectPage() {
	const router = useRouter();

	console.info('pathname', router.pathname);
	console.info('query', router.query);

	// send a request to some backend server
	// to fetch the pice of data with an id of router.query.projectid

	return (
		<div>
			<h1>The Portfolio Project Page</h1>
		</div>
	);
}
