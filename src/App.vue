<template>
  <a-config-provider :locale="locale">
    <a-spin
      :size="32"
      :loading="mainLoading"
      :tip="$t('loading')"
    >
      <a-layout id="app-layout">
        <a-layout-header id="app-header">
          <div>
            <a-menu
              mode="horizontal"
              :default-selected-keys="[currentMenuItem]"
              @menu-item-click="goTo"
            >
              <a-menu-item
                disabled
                id="app-menu-logo"
              >
                <div
                  style="cursor: pointer"
                  @click="goTo('Home')"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <clipPath id="a"><circle
                      cx="60"
                      cy="60"
                      r="47"
                    /></clipPath>
                    <circle
                      fill="#f0f0f0"
                      cx="60"
                      cy="60"
                      r="50"
                    />
                    <rect
                      fill="#1c1c1e"
                      clip-path="url(#a)"
                      x="10"
                      y="10"
                      width="100"
                      height="30"
                    />
                    <rect
                      fill="#f0f0f0"
                      clip-path="url(#a)"
                      x="10"
                      y="40"
                      width="100"
                      height="40"
                    />
                    <rect
                      fill="#ffb003"
                      clip-path="url(#a)"
                      x="10"
                      y="80"
                      width="100"
                      height="30"
                    />
                  </svg>
                </div>
              </a-menu-item>
              <a-menu-item
                v-for="item in menu"
                :key="item.key"
              >
                {{ item.name }}
              </a-menu-item>
            </a-menu>
            <a-space id="app-header-right">
              <a-dropdown
                @select="handlerUserDropDown"
              >
                <a-button
                  type="text"
                  style="padding: 0; color: unset"
                >
                  <a-badge
                    status="success"
                    dot
                    :count="1"
                    v-if="user.username"
                  >
                    <icon-user />
                  </a-badge>
                  <icon-user v-else />
                </a-button>
                <template #content>
                  <a-doption
                    v-for="item in userDropDown"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </a-doption>
                </template>
              </a-dropdown>
            </a-space>
          </div>
        </a-layout-header>
        <a-layout-content>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-spin>
  </a-config-provider>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import {locale} from './locale';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {signOutAPI} from './api/user';
import Aegis from 'aegis-web-sdk';
import {getRUMConfigAPI} from './api/trace';

// locale
const i18n = useI18n();

// title
const title = ref(i18n.t('LinuxDoHelper'));
document.title = title.value;

// menu
const menu = ref([
  {
    key: 'Home',
    name: i18n.t('Home'),
    path_match: '/',
  },
  {
    key: 'VirtualContentStats',
    name: i18n.t('Ranking'),
    path_match: '/virtual_content/stats',
  },
  {
    key: 'VirtualContentShare',
    name: i18n.t('Distribute'),
    path_match: '/virtual_content/share',
  }, {
    key: 'VirtualContentReceiveHistory',
    name: i18n.t('Mine'),
    path_match: '/virtual_content/receive_history',
  },
]);
const router = useRouter();
const currentMenuItem = ref(menu.value[0].key);
const goTo = (key) => {
  router.push({name: key});
};
menu.value.forEach((item, index) => {
  if (index === 0) return;
  if (window.location.pathname.startsWith(item.path_match)) currentMenuItem.value = item.key;
});

// store
const store = useStore();
const mainLoading = computed(() => store.state.mainLoading);
store.dispatch('getUserInfo');

// user
const user = computed(() => store.state.user);
const userDropDown = computed(() => {
  if (user.value.username) {
    return [
      {
        name: `${i18n.t('Logout')} (${user.value.nick_name ? user.value.nick_name : user.value.username})`,
        value: 'logout',
      },
    ];
  }
  return [
    {
      name: i18n.t('Login'),
      value: 'login',
    },
  ];
});
const handlerUserDropDown = (key) => {
  if (key === 'logout') {
    signOutAPI().finally(() => window.location.reload());
  }
};

// aegis
const initRUM = () => {
  getRUMConfigAPI()
      .then((res) => {
        if (res.data.id) {
          new Aegis(res.data);
        }
      });
};
onMounted(() => initRUM());
</script>

<style>
@import "App.css";

#app-layout {
  height: calc(100 * var(--vh));
  width: 100vw;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);;
}

#app-header {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--color-border-1);
}

#app-header > div {
  display: flex;
  justify-content: space-around;
}

#app-header-right {
  display: flex;
  align-items: center;
  padding: 14px 20px 14px 0;
}

#app-menu-logo {
  padding-left: 0;
  margin-left: 0;
  background: unset;
}

#app-header-menu-lang {
  cursor: pointer;
  margin-right: 12px;
}

#app-menu-logo > div {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-medium);
  cursor: text;
  color: var(--color-text-1);
  text-align: center;
  font-weight: bold;
}

#app-footer {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-top: 1px solid var(--color-border-1);
  color: var(--color-text-1);
  margin-top: 20px;
}
</style>
