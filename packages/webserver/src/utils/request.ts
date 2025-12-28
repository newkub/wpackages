export function getQuery(req: Request): Record<string, string> {
  const url = req.url;
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) {
    return {};
  }

  const queryString = url.substring(queryIndex + 1);
  const params = queryString.split('&');
  const query: Record<string, string> = {};

  for (const param of params) {
    const [key, value] = param.split('=');
    if (key) {
      query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  }
  return query;
}

export async function readBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch (_e) {
    return undefined;
  }
}
