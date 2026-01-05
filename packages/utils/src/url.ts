export const getPathnameFromUrl = (rawUrl: string): string => {
	if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
		return new URL(rawUrl).pathname;
	}

	const q = rawUrl.indexOf("?");
	const h = rawUrl.indexOf("#");
	const end = q === -1
		? h === -1
			? rawUrl.length
			: h
		: h === -1
		? q
		: Math.min(q, h);
	return rawUrl.slice(0, end);
};
