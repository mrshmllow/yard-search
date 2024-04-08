import { ArrowsUpDownIcon, Bars3Icon, BarsArrowDownIcon, BarsArrowUpIcon, StarIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSortBy } from "react-instantsearch";
import { motion } from "framer-motion"
import { cva } from "class-variance-authority";

const DESC = "chapters:uploaded:desc";
const ASC = "chapters:uploaded:asc";

const sortByButton = cva("rounded-lg flex justify-center h-full place-items-center gap-2 px-4 ml-auto", {
	variants: {
		sort: {
			default: "bg-white bg-opacity-10 text-white",
			other: "bg-white text-black"
		}
	},
	defaultVariants: {
		sort: "default"
	}
})

export default function SortBy() {
	const {
		currentRefinement,
		options,
		refine,
	} = useSortBy({
		items: [
			{
				label: "Newest First", value: DESC
			},
			{
				label: "Oldest First", value: ASC
			},
			{
				label: "Relevant", value: "chapters"
			}],
	});
	const [step, setStep] = useState(0);

	return <motion.button className={sortByButton({ sort: currentRefinement === "chapters" ? "default" : "other" })} onClick={() => {
		setStep(step => (step + 1) % options.length);
		refine(options[step].value)
	}}
		whileTap={{ scale: 0.9 }}
	>
		{options.find((el) => el.value === currentRefinement)?.label}

		{currentRefinement === "chapters" ?
			<ArrowsUpDownIcon className="w-4 h-4" /> :
			currentRefinement === DESC ?
				<BarsArrowDownIcon className="w-4 h-4" /> : <BarsArrowUpIcon className="w-4 h-4" />
		}
	</motion.button>
}
