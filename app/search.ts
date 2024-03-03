import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { env } from "@/env";

export const { searchClient } = instantMeiliSearch(
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
			cropLength: 60
		},
	}
);

export interface Chapter {
	chapter: string;
	youtube_id: string;
	trans: string;
	episode: number;
	id: string;
	offset: number
}

