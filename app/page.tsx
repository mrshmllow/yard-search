import HomeLink from './(components)/HomeLink';
import HomeSearch from './home_search';

export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<main className="px-4 w-full md:max-w-4xl">
			<HomeLink />

			<HomeSearch />
		</main>
	);
}
