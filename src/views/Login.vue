<script setup>
import {getSignInUrlAPI} from '@/api/user';
import {onMounted, ref} from 'vue';
import {Message} from '@arco-design/web-vue';
import {useI18n} from 'vue-i18n';

const i18n = useI18n();

const title = ref(`${i18n.t('Login')} - ${i18n.t('LinuxDoVCD')}`);
document.title = title.value;

const doLogin = () => {
  getSignInUrlAPI().then(
      (res) => {
        window.location.href = res.data;
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  );
};

onMounted(() => doLogin());
</script>

<template>
  <a-spin
    :loading="true"
    :tip="$t('Redirecting')"
    :size="32"
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column"
  />
</template>

<style scoped>

</style>
