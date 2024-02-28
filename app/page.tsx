"use client";

import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

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
			cropLength: 30
		},
	}
);

const Hit = ({ hit }) => <div className="border border-black rounded flex flex-col p-4">
	<Highlight attribute="chapter" className="font-bold" hit={hit} />
	<Highlight attribute="trans" hit={hit} />
</div>;

export default function Home() {
	return (
		<main className="p-4">
			<h1>yard-search</h1>

			<InstantSearch
				indexName="chapters"
				searchClient={searchClient}
			>
				<SearchBox
					classNames={{
						form: "flex",
						input: "flex-grow",
					}}
				/>
				<Hits hitComponent={Hit} classNames={{
					list: "flex flex-col gap-4"
				}} />
			</InstantSearch>
		</main>
	);
}
