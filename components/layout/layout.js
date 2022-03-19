import MainHeader from './main-header';

export default function Layout(props) {
	return (
		<>
			<MainHeader />
			<main>{props.children}</main>
		</>
	);
}
