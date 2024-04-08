"use client";

import { Configure, Highlight, InfiniteHits, useInfiniteHits, useInstantSearch } from 'react-instantsearch';
import { EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SearchBox from "./(components)/SearchBox";
import SortBy from './(components)/SortBy';
import { Hit, BaseHit } from "instantsearch.js";
import Link from 'next/link';
import {
	EMPTY_ELLIPSIS, strip_timestamps
} from "@/app/lib";
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { createContext, useContext, useMemo, useState } from 'react';
import { Chapter, searchClient } from './search';
import NoResultsBoundary from './(components)/NoResultsBoundary';
import NoResults from './(components)/NoResults';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';

const EpisodeFilteringContext = createContext<{
	filterEpisode: (id: string) => void;
}>({
	filterEpisode: () => { },
})

const Hit = ({ hit }: { hit: Hit<BaseHit & Chapter> }) => {
	const { filterEpisode } = useContext(EpisodeFilteringContext)

	const value = useMemo(() => {
		if (hit._highlightResult === undefined) return null;

		let value = hit._highlightResult.trans

		// TODO: Fix this so it wont break if we are randomly given an array because we probably could be
		if (Array.isArray(value)) return null;

		if ((typeof value.value) === "string") return value.value as string

		return null
	}, [hit]);

	return <Link
		className="border border-black rounded flex flex-col" href={`${hit.youtube_id}?offset=${hit.offset}&autoplay=1`} key={hit.id}>
		<div className="rounded-lg border-gray-500 border px-2 py-2 flex flex-col relative group">
			<div className="flex place-items-center gap-2">
				<span className="font-bold">Episode {hit.episode}</span>

				<Highlight attribute="chapter" className="text-gray-300" hit={hit} classNames={{
					highlighted: "bg-white text-black",
				}} />
			</div>

			<div className="absolute top-2 right-2">
				<Menu as="div" className="relative inline-block text-right">
					<Menu.Button className="bg-white bg-opacity-10 text-white rounded-md p-1">
						<EllipsisHorizontalIcon className="w-6 h-6" />
					</Menu.Button>

					<Menu.Items className="p-2 bg-zinc-900 rounded-lg">
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${active ? 'bg-white text-black' : 'text-white'
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									onClick={(e) => {
										e.preventDefault()
										filterEpisode(hit.youtube_id)
									}}
								>
									Ignore Episode {hit.episode}
								</button>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${active ? 'bg-white text-black' : 'text-white'
										} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									onClick={(e) => {
										e.preventDefault()
										navigator.share({
											url: `https://youtu.be/${hit.youtube_id}?t=${hit.offset}`,
										})
									}}
								>
									Share Chapter ({hit.episode} {'"'}{hit.chapter}{'"'})
								</button>
							)}
						</Menu.Item>
					</Menu.Items>
				</Menu>
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

const demoVariants = {
	animate: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const Hits = () => {
	const { hits } = useInfiniteHits<BaseHit & Chapter>();
	const { status } = useInstantSearch()

	return <motion.ol className="flex gap-2 flex-col" variants={demoVariants} animate="animate">
		{(status === 'loading' || status === 'stalled') ? <>
			{[...Array(10)].map((n, index) => (
				<motion.div key={index} initial={{ opacity: 0 }} variants={demoVariants} className="bg-white bg-opacity-20 rounded-lg animate-pulse w-full h-40" >
				</motion.div>
			))}
		</> : <>
			{hits.map((hit, index) => (
				<li key={hit.objectID}>
					<Hit hit={hit} />
				</li>
			))}
		</>}

	</motion.ol>
}

const pluralize = (count: number, noun: string, suffix = 's') =>
	`${count} ${noun}${count !== 1 ? suffix : ''}`;

export default function HomeSearch() {
	const [filteredEpisodes, setFilteredEpisodes] = useState<Set<string>>(new Set());

	return <EpisodeFilteringContext.Provider value={{
		filterEpisode: (id) => {
			setFilteredEpisodes(filteredEpisodes => { return new Set(filteredEpisodes).add(id) })
			console.log(filteredEpisodes, filteredEpisodes.size)
		},
	}}><InstantSearchNext searchClient={searchClient} indexName="chapters" routing>
			<div className="flex flex-col gap-2">
				<SearchBox />

				<Configure filters={`NOT youtube_id IN [${Array.from(filteredEpisodes).join(",")}]`} />

				<div className="grid grid-flow-row gap-2">
					<div className="h-10 flex justify-between gap-2">
						{filteredEpisodes.size > 0 && <button className="bg-white text-black rounded-full flex justify-center h-full place-items-center gap-2 px-4" onClick={(e) => {
							setFilteredEpisodes(new Set())
						}}>
							<span>{pluralize(filteredEpisodes.size, "Episode")} Ignored</span>
							{<XMarkIcon className="w-4 h-4 text-black" />}
						</button>}

						<SortBy />
					</div>
				</div>

				<Hits />
			</div>
		</InstantSearchNext>
	</EpisodeFilteringContext.Provider>
}
