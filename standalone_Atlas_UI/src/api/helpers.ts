export const unwrapList = <T = any>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.results)) return payload.results;

  if (Array.isArray(payload?.data)) return payload.data;

  return []; // 🔥 ALWAYS RETURN ARRAY
};
