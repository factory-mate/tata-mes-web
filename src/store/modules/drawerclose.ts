import { defineStore } from 'pinia';
import { sessionStorage } from '@/utils/storage';
const useDrawerStore = defineStore({
  id: 'drawerclose',
  state: () => ({
    drawer: false
  }),
  actions: {
    setDrawer(value: boolean) {
      if (
        sessionStorage.get('ModelCode') &&
        sessionStorage.get('routerMeta').title !== '业务方案档案'
      ) {
        sessionStorage.remove('ModelCode');
      }
      this.drawer = value;
    },
    setDrawerOpen(value: boolean) {
      this.drawer = value;
    }
  }
});
export default useDrawerStore;
