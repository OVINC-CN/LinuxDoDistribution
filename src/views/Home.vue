<template>
  <a-space
    :fill="true"
    id="home"
  >
    <a-space
      id="home-space"
      direction="vertical"
    >
      <h2 id="home-space-title">
        {{ i18n.t("LinuxDoHelper") }}
      </h2>
    </a-space>
  </a-space>
</template>

<script setup>
import {useI18n} from 'vue-i18n';

const i18n = useI18n();
</script>

<style scoped>
#home {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
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
  color: var(--color-neutral-10);
  margin: 0;
  text-shadow:
      1px 1px 0 white,
      -1px 1px 0 white,
      1px -1px 0 white,
      -1px -1px 0 white,
      0px 1px 0 white,
      1px 0px 0 white,
      0px -1px 0 white,
      -1px 0px 0 white;
}
</style>
