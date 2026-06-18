export const extractArray = (response) => {
  if (!response) return [];
  const d = response.data ?? response;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d.tabs)) return d.tabs;
  if (Array.isArray(d.activities)) return d.activities;
  if (Array.isArray(d.logs)) return d.logs;
  if (Array.isArray(d.users)) return d.users;
  return [];
};

export default extractArray;
