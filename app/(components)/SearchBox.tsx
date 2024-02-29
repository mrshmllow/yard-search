import { useInstantSearch, useSearchBox } from 'react-instantsearch';
import { XMarkIcon, MagnifyingGlassIcon, FunnelIcon, BarsArrowDownIcon } from '@heroicons/react/24/solid';
import { useState, useRef } from 'react';

export default function SearchBox() {
	const { query, refine } = useSearchBox();
	const { status } = useInstantSearch();
	const [inputValue, setInputValue] = useState(query);
	const inputRef = useRef(null);

	const isSearchStalled = status === 'stalled';

	function setQuery(newQuery) {
		setInputValue(newQuery);

		refine(newQuery);
	}

	// <SearchBox
	// 	placeholder="Search for bits..."
	// 	classNames={{
	// 		input: "",
	// 		form: "",

	// 		submit: "",
	// 		submitIcon: "",

	// 		reset: "",
	// 		resetIcon: ""
	// 	}}
	// 	submitIconComponent={({ classNames }) => (
	// 		
	// 	)}
	// 	resetIconComponent={({ classNames }) => (
	// 		<XMarkIcon className={classNames.resetIcon} />
	// 	)}
	// />

	return <form
		className="flex gap-2"
		action=""
		role="search"
		noValidate
		onSubmit={(event) => {
			event.preventDefault();
			event.stopPropagation();

			if (inputRef.current) {
				inputRef.current.blur();
			}
		}}
		onReset={(event) => {
			event.preventDefault();
			event.stopPropagation();

			setQuery('');

			if (inputRef.current) {
				inputRef.current.focus();
			}
		}}
	>
		<input
			ref={inputRef}
			className="bg-black rounded-lg h-10 focus:border-white focus:ring-white flex-grow"
			autoComplete="off"
			autoCorrect="off"
			autoCapitalize="off"
			placeholder="Search for bits"
			spellCheck={false}
			maxLength={512}
			type="search"
			value={inputValue}
			onChange={(event) => {
				setQuery(event.currentTarget.value);
			}}
			autoFocus
		/>

		<button type="submit" className="bg-white rounded-lg w-10 grid place-items-center"
			aria-label="Serach"
		>
			<MagnifyingGlassIcon className="w-4 h-4 text-black" />
		</button>

		<button
			className="w-10 grid place-items-center"
			type="reset"
			hidden={inputValue.length === 0 || isSearchStalled}
			aria-label="Reset"
		>
			<XMarkIcon className="w-4 h-4 text-white" />
		</button>
	</form>

}
