"use client";

import Link from 'next/link';
import ChapterSearch from './chapter_search';

export const dynamic = 'force-dynamic';

export default function Episode({ params }: { params: { youtube_id: string } }) {
	return <main className="px-4 w-full">
		<Link href="/"><h1 className="py-4">yard search</h1></Link>

		<ChapterSearch youtube_id={params.youtube_id} />
	</main>
}
