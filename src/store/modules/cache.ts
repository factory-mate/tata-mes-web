import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';

const useCacheStore = defineStore('cache', () => {
  const invalidPages = new Set<string>();

  const route = useRoute();

  const addInvalidPage = (name: string) => {
    invalidPages.add(name);
  };

  const removeInvalidPage = (name: string) => {
    invalidPages.delete(name);
  };

  const isCurrentPageInvalid = () => {
    return invalidPages.has(route.name as string);
  };

  const removeCurrentPageInvalid = () => {
    invalidPages.delete(route.name as string);
  };

  return {
    invalidPages,
    addInvalidPage,
    removeInvalidPage,
    isCurrentPageInvalid,
    removeCurrentPageInvalid
  };
});

export default useCacheStore;
