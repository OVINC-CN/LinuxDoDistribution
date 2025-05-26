<script setup>
import {signInAPI} from '@/api/user';
import {onMounted} from 'vue';
import {Message} from '@arco-design/web-vue';
import globalContext from '@/context';

const doLogin = () => {
  const url = new URL(window.location.href);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  signInAPI({code, state}).then(
      () => {},
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(
      () => {
        setTimeout(() => {
          const next = localStorage.getItem('login-next');
          window.location.href = next || globalContext.siteUrl;
        }, 2000);
      },
  );
};

onMounted(() => doLogin());
</script>

<template>
  <a-spin
    :loading="true"
    :tip="$t('VerifyingUserInfo')"
    :size="32"
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column"
  />
</template>

<style scoped>

</style>
