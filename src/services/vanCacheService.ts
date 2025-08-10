let vanDataCached = false;

export const isVanDataCached = (): boolean => {
  return vanDataCached;
};

export const setVanDataCached = (cached: boolean): void => {
  vanDataCached = cached;
};