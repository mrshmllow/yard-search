const SUB_TIMESTAMPS = /\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/gm;
const CAPTURE_TIMESTAMPS = /(?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2})\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}(?<text>.*)/;

const SUB_BROKEN_TIMESTAMPS = /\d+:?\.?|--&gt;/g;
export const EMPTY_ELLIPSIS = /^ *?…$/;

function maintain_html_codes(string: string) {
	// Must do this to maintain html codes
	return string.replace(/&#(\d+);/g, (match, decimal) => {
		return String.fromCharCode(parseInt(decimal, 10));
	});
}

export function strip_timestamps(string: string) {
	return maintain_html_codes(string).replace(SUB_TIMESTAMPS, "").replaceAll(SUB_BROKEN_TIMESTAMPS, "")
}

export function get_timetamp(string: string, offset: number) {
	const decoded_string = maintain_html_codes(string);

	let groups = decoded_string.match(CAPTURE_TIMESTAMPS)?.groups
	let value = decoded_string.replaceAll(SUB_TIMESTAMPS, "");

	if (groups === undefined) {
		return {
			seconds: 0,
			value
		}
	}

	let seconds = offset + Number(groups.seconds) + (Number(groups.minutes) * 60) + (Number(groups.hours) * 60 * 60)

	return {
		seconds,
		value
	}
}

