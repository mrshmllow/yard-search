"use client";

import { InstantSearch, Hits, Highlight, HitsProps, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon, BarsArrowDownIcon } from '@heroicons/react/24/solid';
import SearchBox from "./(components)/SearchBox";
import SortBy from './(components)/SortBy';

const { searchClient } = instantMeiliSearch(
	'http://127.0.0.1:7700',
	'HWoz-31otPLUyXZmEfFDWpC3osm3XTW0Ebv3GTj5yrg',
	{
		meiliSearchParams: {
			attributesToRetrieve: [
				"id",
				"chapter",
				"youtube_id",
				"uploaded"
			],
			attributesToCrop: ["trans"],
			cropLength: 40
		},
	}
);

const Hit = ({ hit }: { hit: { chapter: string, uploaded: string, youtube_id: string, trans: string } }) => <div className="border border-black rounded flex flex-col">
	<div className="rounded-lg border-gray-500 border px-2 py-2 flex flex-col">
		<div className="flex place-items-center gap-2">
			<span className="font-bold">Episode 136</span>

			<Highlight attribute="chapter" className="text-gray-300" hit={hit} classNames={{
				highlighted: "bg-white text-black",
			}} />
		</div>

		<Highlight attribute="trans" hit={hit} classNames={{
			highlighted: "bg-white text-black",
		}} />
	</div>
</div>;

export default function Home() {
	return (
		<main className="px-4">
			<h1 className="py-4">yard search</h1>

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

					<Hits hitComponent={Hit} classNames={{
						list: "flex gap-2 flex-col"
					}} />
				</div>
			</InstantSearch>
		</main>
	);
}
