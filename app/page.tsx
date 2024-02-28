"use client";

import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { XMarkIcon, FunnelIcon, BarsArrowDownIcon } from '@heroicons/react/24/solid';

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

// const Hit = ({ hit }) => <div className="border border-black rounded flex flex-col p-4">
//   <Highlight attribute="chapter" className="font-bold" hit={hit} />
//   <Highlight attribute="trans" hit={hit} />
// </div>;

export default function Home() {
  return (
    <main className="px-4">
      <h1 className="py-4">yard search</h1>

      <div className="flex flex-col gap-2">
        <div className="grid grid-flow-row gap-2">
          <div className="flex gap-3">
            <input className="bg-black rounded-lg h-10 focus:border-white focus:ring-white flex-grow" placeholder="Search..." />
          </div>

          <div className="h-10 flex justify-between gap-2">
            <div className="flex gap-2">
              <button className="bg-white rounded-lg flex justify-center h-full place-items-center gap-2 px-4">
                <span className="text-black">Filter</span>
                <FunnelIcon className="w-4 h-4 text-black" />
              </button>

              <button className="bg-white rounded-full flex justify-center h-full place-items-center gap-2 px-4">
                <span className="text-black">3 Eps Ignored</span>
                <XMarkIcon className="w-4 h-4 text-black" />
              </button>
            </div>

            <button className="bg-white rounded-lg flex justify-center h-full place-items-center gap-2 px-4">
              <span className="text-black">Newest First</span>
              <BarsArrowDownIcon className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-col">
          {[...Array(10)].map(
            (_, i) =>
              <div className="rounded-lg border-gray-500 border px-2 py-2 flex flex-col" key={i}>
                <div className="flex place-items-center gap-2">
                  <span>Episode 10{i}</span>

                  <span className="text-gray-300">Intro</span>
                </div>

                <span>
                  text and subtitles and subtiles and subtitles text and text and more text here
                </span>
              </div>
          )}
        </div>
      </div>
    </main>
  );
}
