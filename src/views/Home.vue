<script setup>
import {useI18n} from 'vue-i18n';
import {ref} from 'vue';

const i18n = useI18n();

// title
const title = ref(i18n.t('LinuxDoVCD'));
document.title = title.value;
</script>

<template>
  <div id="home">
    <a-space
      id="home-space"
      direction="vertical"
    >
      <h2 id="home-space-title">
        {{ i18n.t("LinuxDoVCD") }}
      </h2>
    </a-space>
  </div>
</template>

<style scoped>
#home {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

#home-space {
  box-shadow: var(--shadow2-center);
  padding: 60px 80px;
  align-items: center;
  border-radius: var(--border-radius-medium);
  background: linear-gradient(
      135deg,
      #1c1c1e 0%,
      #1c1c1e 33.33%,
      #f0f0f0 33.33%,
      #f0f0f0 66.66%,
      #ffb003 66.66%,
      #ffb003 100%
  );
}

#home-space-title {
  font-size: 24px;
  color: black;
  margin: 0;
  text-shadow:
      1px 1px 0 white,
      -1px 1px 0 white,
      1px -1px 0 white,
      -1px -1px 0 white,
      0 1px 0 white,
      1px 0 0 white,
      0 -1px 0 white,
      -1px 0 0 white;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

#home-share {
  width: 600px;
  max-width: calc(100vw - 40px);
  height: 600px;
  max-height: calc(100 * var(--vh) - 110px);
  overflow: hidden;
  background: var(--color-bg-1);
  box-shadow: var(--shadow2-center);
  border-radius: var(--border-radius-medium);
  padding: 20px;
  box-sizing: border-box;
}

#home-share > :deep(.arco-space-item) {
  width: 100%;
}

.home-share-title {
  color: var(--color-text-1);
  text-align: center;
  word-break: break-all;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: bold;
}
</style>
