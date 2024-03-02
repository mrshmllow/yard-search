import Link from 'next/link';
import HomeSearch from './home_search';

export const dynamic = 'force-dynamic';

export default function Home() {
	return (
		<main className="px-4 w-full">
			<Link href="/"><h1 className="py-4">yard search</h1></Link>

			<HomeSearch />
		</main>
	);
}
