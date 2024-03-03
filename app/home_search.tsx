"use client";

import { Highlight, InfiniteHits, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { XMarkIcon } from '@heroicons/react/24/solid';
import SearchBox from "./(components)/SearchBox";
import SortBy from './(components)/SortBy';
import { Hit, BaseHit } from "instantsearch.js";
import { env } from "@/env";
import Link from 'next/link';
import {
	EMPTY_ELLIPSIS, strip_timestamps
} from "@/app/lib";
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { useMemo } from 'react';
import { searchClient } from './search';

interface Chapter {
	chapter: string;
	youtube_id: string;
	trans: string;
	episode: number;
	id: string;
}

const Hit = ({ hit }: { hit: Hit<BaseHit & Chapter> }) => {
	const value = useMemo(() => {
		if (hit._highlightResult === undefined) return null;

		let value = hit._highlightResult.trans

		// TODO: Fix this so it wont break if we are randomly given an array because we probably could be
		if (Array.isArray(value)) return null;

		if ((typeof value.value) === "string") return value.value as string

		return null
	}, [hit]);

	return <Link className="border border-black rounded flex flex-col" href={`${hit.youtube_id}?offset=${hit.offset}&autoplay=1`} key={hit.id}>
		<div className="rounded-lg border-gray-500 border px-2 py-2 flex flex-col">
			<div className="flex place-items-center gap-2">
				<span className="font-bold">Episode {hit.episode}</span>

				<Highlight attribute="chapter" className="text-gray-300" hit={hit} classNames={{
					highlighted: "bg-white text-black",
				}} />
			</div>

			<div className="flex flex-col gap-2">
				{value && value.split("\n\n").filter(line => !line.startsWith("WEBVTT")).map(string => {
					const stripped = strip_timestamps(string);

					if (stripped.match(EMPTY_ELLIPSIS)) return <></>

					return <Highlight attribute="split" hit={{
						"_highlightResult": {
							"split": {
								// @ts-ignore
								"value": stripped
							}
						}
					}}
						classNames={{
							highlighted: "bg-white text-black rounded-sm",
						}}
						// TODO: Fix non-unique key
						key={`${hit.youtube_id}${hit.chapter}${string}`}
					/>
				})}
			</div>
		</div>
	</Link>;
}

export default function HomeSearch() {
	return <InstantSearchNext searchClient={searchClient} indexName="chapters" routing>
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
	</InstantSearchNext>
}
