import useUserStore from './modules/user';
import useAppStore from './modules/app';
import usePermissionStore from './modules/permission';
import useSettingStore from './modules/settings';
import useTagsViewStore from './modules/tagsView';
import useDrawerStore from './modules/drawerclose';
import useCacheStore from './modules/cache';

const useStore = () => ({
  user: useUserStore(),
  app: useAppStore(),
  permission: usePermissionStore(),
  setting: useSettingStore(),
  tagsView: useTagsViewStore(),
  drawerclose: useDrawerStore(),
  cache: useCacheStore()
});

export default useStore;
