const escapeHtml = (input: string) => {
	return input
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll("\"", "&quot;")
		.replaceAll("'", "&#039;");
};

const escapeRegExp = (input: string) => {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const highlight = (text: string, query: string): string => {
	const q = query.trim();
	if (!q) return escapeHtml(text);

	const tokens = q.split(/\s+/).filter(Boolean).slice(0, 8);
	if (tokens.length === 0) return escapeHtml(text);

	const pattern = tokens.map(escapeRegExp).join("|");
	const re = new RegExp(`(${pattern})`, "ig");

	return escapeHtml(text).replace(re, "<mark class=\"hl\">$1</mark>");
};

export const safeUrlHost = (url: string): string => {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
};

export const faviconUrl = (url: string): string => {
	const host = safeUrlHost(url);
	const encoded = encodeURIComponent(host);
	return `https://www.google.com/s2/favicons?domain=${encoded}&sz=64`;
};
