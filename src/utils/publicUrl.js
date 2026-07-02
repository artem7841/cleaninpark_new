export const publicUrl = (path) => {
  const base = process.env.PUBLIC_URL || "";
  const normalizedPath = path.replace(/^\/+/, "");
  return `${base}/${normalizedPath}`.replace(/([^:]\/)\/+/g, "$1");
};
