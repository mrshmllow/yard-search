"use client";

import { InstantSearch, Highlight, InfiniteHits, Configure, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { env } from "@/env";
import { Hit, BaseHit } from "instantsearch.js";
import Link from 'next/link';
import { get_timetamp } from '../lib';
import { createContext, useContext, useState } from 'react';
import Youtube from "react-youtube"
import { YouTubePlayer } from "react-youtube";

const { searchClient } = instantMeiliSearch(
	env.NEXT_PUBLIC_MEILISEARCH_URL,
	env.NEXT_PUBLIC_MEILISEARCH_KEY,
	{
		meiliSearchParams: {
			attributesToRetrieve: [
				"id",
				"chapter",
				"youtube_id",
				"uploaded",
				"episode",
				"trans",
				"offset"
			],
			attributesToCrop: ["trans"],
		},
	}
);

interface Chapter {
	chapter: string;
	uploaded: string;
	youtube_id: string;
	trans: string;
	episode: number;
	offset: number
}

const SeekContext = createContext({
	seekTo: async (i: number) => {
		console.log("called, here");
	}
})

const ChapterHit = ({ hit }: { hit: Hit<BaseHit & Chapter> }) => {
	const { seekTo } = useContext(SeekContext);
	return <div className="border border-black rounded flex flex-col" id={hit.chapter}>
		<div className="rounded-lg px-2 flex flex-col">
			<div className="flex place-items-center gap-2">
				<Highlight attribute="chapter" className="font-bold" hit={hit} classNames={{
					highlighted: "bg-white text-black",
				}} />
			</div>

			<div className="flex flex-col gap-2">
				{hit.trans.split("\n\n").filter(line => !line.startsWith("WEBVTT")).map(string => {
					const line = get_timetamp(string, hit.offset);

					if (line.value === "") return <></>

					return <button onClick={async () => {
						await seekTo(line.seconds)
					}} className="text-left">
						<Highlight attribute="split" hit={{
							"_highlightResult": {
								"split": {
									"value": line.value
								}
							}
						}}
							classNames={{
								highlighted: "bg-white text-black rounded-sm",
							}}
						/>
					</button>
				})}
			</div>
		</div>
	</div>
};

export default function Episode({ params }: { params: { youtube_id: string } }) {
	const [yt, setYt] = useState<YouTubePlayer>(null);

	return <SeekContext.Provider value={{
		seekTo: async (i) => {
			yt.seekTo(i, true)
			yt.playVideo()
		}
	}}>
		<main className="px-4">
			<Link href="/"><h1 className="py-4">yard search</h1></Link>

			<InstantSearch searchClient={searchClient} indexName="chapters">
				<Configure filters={`youtube_id = ${params.youtube_id}`} hitsPerPage={5} />
				<Youtube
					videoId={params.youtube_id}
					onReady={(event) => {
						setYt(event.target)
					}}
				/>

				<div className="flex flex-col gap-2">
					<InfiniteHits hitComponent={ChapterHit} classNames={{
						root: "flex flex-col",
						list: "flex gap-2 flex-col",
						loadMore: "bg-white bg-opacity-10 text-white rounded-lg px-4 h-10 my-4 w-full place-self-center md:w-fit",
						disabledLoadMore: "hidden"
					}} showPrevious={false} />
				</div>
			</InstantSearch>
		</main>
	</SeekContext.Provider>
}
