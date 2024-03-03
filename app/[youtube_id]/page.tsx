"use client";

import ChapterSearch from './chapter_search';
import HomeLink from '../(components)/HomeLink';

export const dynamic = 'force-dynamic';

export default function Episode({ params, searchParams }: { params: { youtube_id: string }, searchParams: { offset?: number, autoplay?: boolean } }) {
	return <main className="px-4 w-full">
		<HomeLink sticky />

		<ChapterSearch youtube_id={params.youtube_id} jump_to={searchParams.offset ? searchParams.offset : 0} autoplay={searchParams.autoplay ? searchParams.autoplay : false} />
	</main>
}
