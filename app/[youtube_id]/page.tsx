"use client";

import Link from 'next/link';
import ChapterSearch from './chapter_search';

export const dynamic = 'force-dynamic';

export default function Episode({ params, searchParams }: { params: { youtube_id: string }, searchParams: { offset?: number, autoplay?: boolean } }) {
	return <main className="px-4 w-full">
		<Link href="/"><h1 className="py-4">yard search</h1></Link>

		<ChapterSearch youtube_id={params.youtube_id} jump_to={searchParams.offset ? searchParams.offset : 0} autoplay={searchParams.autoplay ? searchParams.autoplay : false} />
	</main>
}
