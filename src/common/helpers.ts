export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const nap = () => sleep(0);

export const noop = () => {};
