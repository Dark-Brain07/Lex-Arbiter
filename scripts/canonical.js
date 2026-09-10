export function canonicalJson(obj) {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalJson).join(",") + "]";
  }
  const sortedKeys = Object.keys(obj).sort();
  return (
    "{" +
    sortedKeys
      .map((key) => JSON.stringify(key) + ":" + canonicalJson(obj[key]))
      .join(",") +
    "}"
  );
}
