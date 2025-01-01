import NodeCache from 'node-cache';

const movieCache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); 

// Function to get cached data
export const getCache = (key: string) => {
  const cachedData = movieCache.get(key);
  if (cachedData) {
    return cachedData;
  }
  return null;
};

// Function to set data in cache
export const setCache = (key: string, value: any) => {
  movieCache.set(key, value);
};

// Function to delete cache data
export const deleteCache = (key: string) => {
  movieCache.del(key);
};
