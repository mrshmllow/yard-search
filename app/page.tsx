"use client";

import { InstantSearch, Hits, Highlight, HitsProps, InfiniteHits, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon, BarsArrowDownIcon } from '@heroicons/react/24/solid';
import SearchBox from "./(components)/SearchBox";
import SortBy from './(components)/SortBy';
import { Hit, BaseHit } from "instantsearch.js";
import { env } from "@/env";
import Link from 'next/link';
import {
	EMPTY_ELLIPSIS, strip_timestamps, BROKEN_TIMESTAMP_PATTERN,
	FULL_TIMESTAMP_PATTERN
} from "@/app/lib";

const { searchClient } = instantMeiliSearch(
	env.NEXT_PUBLIC_MEILISEARCH_URL,
	env.NEXT_PUBLIC_MEILISEARCH_KEY,
	{
		meiliSearchParams: {
			attributesToRetrieve: [
				"id",
				"chapter",
				"youtube_id",
				"episode",
			],
			attributesToCrop: ["trans"],
			cropLength: 60
		},
	}
);

interface Chapter {
	chapter: string;
	youtube_id: string;
	trans: string;
	episode: number;
}

const Hit = ({ hit }: { hit: Hit<BaseHit & Chapter> }) => <Link className="border border-black rounded flex flex-col" href={`${hit.youtube_id}#${hit.chapter}`}>
	<div className="rounded-lg border-gray-500 border px-2 py-2 flex flex-col">
		<div className="flex place-items-center gap-2">
			<span className="font-bold">Episode {hit.episode}</span>

			<Highlight attribute="chapter" className="text-gray-300" hit={hit} classNames={{
				highlighted: "bg-white text-black",
			}} />
		</div>

		<div className="flex flex-col gap-2">
			{hit._highlightResult.trans.value.split("\n\n").filter(line => !line.startsWith("WEBVTT")).map(string => {
				const stripped = strip_timestamps(string);

				if (stripped.match(EMPTY_ELLIPSIS)) return <></>

				return <>
					<Highlight attribute="split" hit={{
						"_highlightResult": {
							"split": {
								"value": stripped
							}
						}
					}}
						classNames={{
							highlighted: "bg-white text-black rounded-sm",
						}}
					/>
				</>
			})}
		</div>
	</div>
</Link>;

export default function Home() {
	return (
		<main className="px-4">
			<Link href="/"><h1 className="py-4">yard search</h1></Link>

			<InstantSearch searchClient={searchClient} indexName="chapters">
				<div className="flex flex-col gap-2">
					<SearchBox />

					<div className="grid grid-flow-row gap-2">
						<div className="h-10 flex justify-between gap-2">
							<button className="bg-white rounded-full flex justify-center h-full place-items-center gap-2 px-4">
								<span className="text-black">3 Eps Ignored</span>
								<XMarkIcon className="w-4 h-4 text-black" />
							</button>

							<SortBy />
						</div>
					</div>

					<InfiniteHits hitComponent={Hit} classNames={{
						root: "flex flex-col",
						list: "flex gap-2 flex-col",
						loadMore: "bg-white bg-opacity-10 text-white rounded-lg px-4 h-10 my-4 w-full place-self-center md:w-fit",
						disabledLoadMore: "hidden"
					}} showPrevious={false} />
				</div>
			</InstantSearch>
		</main>
	);
}
