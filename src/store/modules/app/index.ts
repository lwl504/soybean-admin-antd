import { ref, watch, effectScope, onScopeDispose } from 'vue';
import { defineStore } from 'pinia';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useBoolean } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { setLocale } from '@/locales';
import { localStg } from '@/utils/storage';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const scope = effectScope();
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean();
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean();

  /**
   * reload page
   * @param duration duration time
   */
  async function reloadPage(duration = 0) {
    setReloadFlag(false);

    if (duration > 0) {
      await new Promise(resolve => {
        setTimeout(resolve, duration);
      });
    }

    setReloadFlag(true);
  }

  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  const localeOptions: App.I18n.LangOption[] = [
    {
      label: '中文',
      key: 'zh-CN'
    },
    {
      label: 'English',
      key: 'en'
    }
  ];

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
    setLocale(lang);
    localStg.set('lang', lang);
  }

  const breakpoints = useBreakpoints(breakpointsTailwind);

  const isMobile = breakpoints.smaller('sm');

  // watch store
  scope.run(() => {
    watch(
      isMobile,
      newValue => {
        if (newValue) {
          setSiderCollapse(true);
        }
      },
      { immediate: true }
    );
  });

  /**
   * on scope dispose
   */
  onScopeDispose(() => {
    scope.stop();
  });

  return {
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    reloadFlag,
    reloadPage,
    fullContent,
    toggleFullContent,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    locale,
    localeOptions,
    changeLocale,
    isMobile
  };
});
