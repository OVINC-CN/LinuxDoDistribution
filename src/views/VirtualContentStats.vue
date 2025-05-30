<script setup>
import {onMounted, ref} from 'vue';
import {listVCStatsAPI} from '@/api/vcd';
import {handleLoading} from '@/utils/loading';
import {useI18n} from 'vue-i18n';

const i18n = useI18n();

const title = ref(`${i18n.t('Ranking')} - ${i18n.t('LinuxDoVCD')}`);
document.title = title.value;

const loading = ref(true);

const shareRank = ref([]);
const receiveRank = ref([]);

const loadStats = () => {
  handleLoading(loading, true);
  listVCStatsAPI().then(
      (res) => {
        shareRank.value = res.data.share;
        receiveRank.value = res.data.receive;
      },
  ).finally(() => {
    handleLoading(loading, false);
  });
};

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div id="vc-stats">
    <a-space
      id="vc-stats-info"
      direction="vertical"
      :size="0"
    >
      <div class="vc-stats-title">
        {{ i18n.t('Ranking') }}
      </div>
      <a-tabs
        default-active-key="1"
        id="vd-stats-tab"
      >
        <a-tab-pane
          key="1"
          :title="i18n.t('ShareRank')"
        >
          <a-list
            :scrollbar="true"
            max-height="min(calc(100 * var(--vh) - 250px), 460px)"
            :loading="loading"
          >
            <a-list-item
              v-for="(item, idx) in shareRank"
              :key="idx"
            >
              <div class="vc-rank-item">
                <span class="vc-rank-title">{{ i18n.t('No.Rand', {rank: idx+1}) }}</span>
                <span class="vc-rank-name">{{ item.user_nickname ? `${item.user_nickname}(${item.user})` : item.user }}</span>
                <span class="vc-rank-value">{{ item.count }}</span>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          :title="i18n.t('ReceiveRank')"
        >
          <a-list
            :scrollbar="true"
            max-height="min(calc(100 * var(--vh) - 250px), 460px)"
            :loading="loading"
          >
            <a-list-item
              v-for="(item, idx) in receiveRank"
              :key="idx"
            >
              <div class="vc-rank-item">
                <span class="vc-rank-title">{{ i18n.t('No.Rand', {rank: idx+1}) }}</span>
                <span class="vc-rank-name">{{ item.user_nickname ? `${item.user_nickname}(${item.user})` : item.user }}</span>
                <span class="vc-rank-value">{{ item.count }}</span>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </a-space>
  </div>
</template>

<style scoped>
#vc-stats {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

#vc-stats-info {
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

#vc-stats-info > :deep(.arco-space-item) {
  width: 100%;
}

.vc-stats-title {
  color: var(--color-text-1);
  text-align: center;
  word-break: break-all;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
}

.vc-rank-title {
  min-width: 40px;
  color: rgb(var(--orange-6));
  font-weight: bold;
}

#vd-stats-tab :deep(.arco-tabs-nav-tab) {
  justify-content: center;
}

#vd-stats-tab :deep(.arco-list-item) {
  padding: 10px;
}

#vd-stats-tab :deep(.arco-list-item-main) {
  width: 100%;
}

.vc-rank-name {
  flex: 1;
  margin: 0 10px;
  color: var(--color-neutral-10);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vc-rank-value {
  color: var(--color-neutral-8);
  text-align: right;
  min-width: 48px;
}

.vc-rank-item {
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
