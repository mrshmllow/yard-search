// Development env set in flake.nix

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {},

	client: {
		NEXT_PUBLIC_MEILISEARCH_URL: z.string().url(),
		NEXT_PUBLIC_MEILISEARCH_KEY: z.string(),
	},

	experimental__runtimeEnv: {
		NEXT_PUBLIC_MEILISEARCH_URL: process.env.NEXT_PUBLIC_MEILISEARCH_URL,
		NEXT_PUBLIC_MEILISEARCH_KEY: process.env.NEXT_PUBLIC_MEILISEARCH_KEY,
	}
});
