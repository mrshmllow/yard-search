import { Highlight, InfiniteHits, Configure } from 'react-instantsearch';
import { Hit, BaseHit } from "instantsearch.js";
import { get_timetamp } from '../lib';
import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Youtube from "react-youtube"
import { YouTubePlayer } from "react-youtube";
import { useInterval } from 'usehooks-ts';
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Chapter, searchClient } from '../search';

const TranscriptLine = memo(function({ string, offset }: { string: string, offset: number }) {
	const line = useMemo(() => get_timetamp(string, offset), [string, offset])
	const { seekTo, duration } = useContext(SeekContext);
	const ref = useRef<HTMLButtonElement>(null)
	const current = useMemo(() => duration > line.seconds && duration < line.end_seconds, [duration, line.seconds, line.end_seconds])

	useEffect(() => {
		if (current) {
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
					// @ts-ignore
					"value": line.value
				}
			}
		}}
			classNames={{
				highlighted: "bg-white text-black rounded-sm",
			}}
		/>
	</button>
})

const ChapterHit = memo(function({ hit }: { hit: Hit<BaseHit & Chapter> }) {
	const lines = useMemo(() => hit.trans.split("\n\n").filter(line => !line.startsWith("WEBVTT")).map(string => <TranscriptLine key={`${hit.id}-${string}`} string={string} offset={hit.offset} />), [hit.trans])

	return <div className="border border-black rounded flex flex-col" id={hit.chapter} key={hit.id}>
		<div className="rounded-lg px-2 flex flex-col">
			<div className="flex place-items-center gap-2">
				<Highlight attribute="chapter" className="font-bold" hit={hit} classNames={{
					highlighted: "bg-white text-black",
				}} />
			</div>

			<div className="flex flex-col gap-2">
				{lines}
			</div>
		</div>
	</div>
});

const SeekContext = createContext({
	seekTo: async (i: number) => {
		console.log("called, here");
	},
	duration: 0
})

export default function ChapterSearch({ youtube_id, jump_to, autoplay }: { youtube_id: string, jump_to: number, autoplay: boolean }) {
	const [yt, setYt] = useState<YouTubePlayer>(null);
	const [duration, setDuration] = useState(-1);
	const [isPlaying, setPlaying] = useState<boolean>(false)

	// I really hate this. Find a better way to do this without an interval
	useInterval(
		() => {
			if (yt === null) return;

			setDuration(yt.getCurrentTime())
		},
		isPlaying ? 1000 : null,
	)

	return <SeekContext.Provider value={{
		seekTo: async (i) => {
			yt.seekTo(i, true)
			yt.playVideo()
		},
		duration
	}}>
		<InstantSearchNext searchClient={searchClient} indexName="chapters">
			<Configure filters={`youtube_id = ${youtube_id}`} hitsPerPage={5} />

			<Youtube
				videoId={youtube_id}
				onReady={(event) => {
					setYt(event.target)
				}}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				className="rounded-lg sticky top-0 overflow-hidden aspect-video relative bg-black shadow-lg"
				iframeClassName=""
				opts={{
					playerVars: {
						start: jump_to,
						playsinline: true,
						autoplay
					},
					host: "https://www.youtube-nocookie.com"
				}}
			/>

			<div className="flex flex-col gap-2 pt-8 pb-4">
				<InfiniteHits hitComponent={ChapterHit} classNames={{
					root: "flex flex-col",
					list: "flex gap-2 flex-col",
					loadMore: "bg-white bg-opacity-10 text-white rounded-lg px-4 h-10 my-4 w-full place-self-center md:w-fit",
					disabledLoadMore: "hidden"
				}} showPrevious={false} />
			</div>
		</InstantSearchNext>
	</SeekContext.Provider>
}
