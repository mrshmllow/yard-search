import { ArrowsUpDownIcon, Bars3Icon, BarsArrowDownIcon, BarsArrowUpIcon, StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSortBy } from "react-instantsearch";

const DESC = "chapters:uploaded:desc";
const ASC = "chapters:uploaded:asc";

export default function SortBy() {
	const {
		currentRefinement,
		options,
		refine,
	} = useSortBy({
		items: [
			{
				label: "Oldest First", value: ASC
			},
			{
				label: "Newest First", value: DESC
			},
			{
				label: "Relevant", value: "chapters"
			}],
	});
	const [step, setStep] = useState(0);

	return <button className="bg-white rounded-lg flex justify-center h-full place-items-center gap-2 px-4 text-black" onClick={() => {
		setStep(step => (step + 1) % options.length);
		refine(options[step].value)
	}}>
		{options.find((el) => el.value === currentRefinement)?.label}

		{currentRefinement === "chapters" ?
			<ArrowsUpDownIcon className="w-4 h-4" /> :
			currentRefinement === DESC ?
				<BarsArrowDownIcon className="w-4 h-4" /> : <BarsArrowUpIcon className="w-4 h-4" />
		}
	</button>
}
