import { useInstantSearch } from "react-instantsearch";

export default function NoResults() {
	const { indexUiState } = useInstantSearch();

	return (
		<div className="pt-4">
			<p className="text-center text-gray-200">
				No results for <q>{indexUiState.query}</q>.
			</p>
		</div>
	);
}

