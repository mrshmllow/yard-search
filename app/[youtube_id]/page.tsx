"use client";

import { InstantSearch, Highlight, InfiniteHits, Configure, useMenu, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { env } from "@/env";
import { Hit, BaseHit } from "instantsearch.js";
import Link from 'next/link';
import { get_timetamp } from '../lib';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Youtube from "react-youtube"
import { YouTubePlayer } from "react-youtube";
import { useInterval } from 'usehooks-ts';

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
	},
	duration: 0
})

const TranscriptLine = ({ string, offset }: { string: string, offset: number }) => {
	const line = useMemo(() => get_timetamp(string, offset), [string, offset])
	const { seekTo, duration } = useContext(SeekContext);
	const ref = useRef<HTMLButtonElement>(null)
	const current = useMemo(() => duration > line.seconds && duration < line.end_seconds, [duration, line.seconds, line.end_seconds])

	useEffect(() => {
		if (current) {
			console.log(line.value, line.seconds, line.end_seconds, "is drawing focus")
			ref.current?.scrollIntoView({
				behavior: "smooth",
			})
		}
	}, [current])

	if (line.value === "") return <></>;

	return <button onClick={async () => {
		await seekTo(line.seconds)
	}} className={`text-left rounded-sm scroll-mt-[50vh] ${current ? "bg-white bg-opacity-10" : ""}`} ref={ref}>
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
};

const ChapterHit = ({ hit }: { hit: Hit<BaseHit & Chapter> }) => {
	const lines = useMemo(() => hit.trans.split("\n\n").filter(line => !line.startsWith("WEBVTT")), [hit])

	return <div className="border border-black rounded flex flex-col" id={hit.chapter}>
		<div className="rounded-lg px-2 flex flex-col">
			<div className="flex place-items-center gap-2">
				<Highlight attribute="chapter" className="font-bold" hit={hit} classNames={{
					highlighted: "bg-white text-black",
				}} />
			</div>

			<div className="flex flex-col gap-2">
				{lines.map(string => <TranscriptLine string={string} offset={hit.offset} />)}
			</div>
		</div>
	</div>
};

export default function Episode({ params }: { params: { youtube_id: string } }) {
	const [yt, setYt] = useState<YouTubePlayer>(null);
	const [duration, setDuration] = useState(-1);
	const [isPlaying, setPlaying] = useState<boolean>(false)

	// I really hate this. Find a better way to do this without an interval
	useInterval(
		() => {
			if (yt === null) return;

			setDuration(yt.getCurrentTime())
		},
		isPlaying ? 100 : null,
	)

	return <SeekContext.Provider value={{
		seekTo: async (i) => {
			yt.seekTo(i, true)
			yt.playVideo()
		},
		duration
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
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					className="rounded-lg sticky top-0 overflow-hidden"
				/>

				<div className="flex flex-col gap-2 pt-8 pb-4">
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
