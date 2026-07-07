import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { useRouter } from 'vue-router';

export const useTagStore = defineStore('tag', () => {
  const router = useRouter();
  const tagList = ref<RouteLocationNormalizedLoadedGeneric[]>([]);
  const addTag = (tag: RouteLocationNormalizedLoadedGeneric) => {
    if (!tagList.value.some((item) => item.path === tag.path)) {
      tagList.value.push(tag);
    }
  };

  const closeTag = (path: string, routePath: string) => {
    const agIndex: number = tagList.value.findIndex((item) => item.path === path);
    if (agIndex !== -1) {
      tagList.value.splice(agIndex, 1);

      if (path === routePath && tagList.value.length > 1) {
        const pushTag = tagList.value[agIndex] ? agIndex : agIndex - 1;

        const targetTag = tagList.value[pushTag];
        if (targetTag) {
          router.push(targetTag.path);
        }
      }
    }
  };
  return {
    tagList,
    addTag,
    closeTag,
  };
});
