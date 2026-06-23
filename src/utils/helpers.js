export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const fmtMoney = (n) => `$${Number(n).toFixed(2)}`;

export const genTxn = () => "TX-" + Math.random().toString(36).slice(2, 8).toUpperCase();

export const lsGet = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const lsSet = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
};

export const paginate = (arr, page, perPage) => {
  const start = (page - 1) * perPage;
  return arr.slice(start, start + perPage);
};
