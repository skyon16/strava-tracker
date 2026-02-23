export const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout: number = 30000,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(id);
  });
};
