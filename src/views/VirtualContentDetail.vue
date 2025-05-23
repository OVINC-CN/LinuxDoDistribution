<script setup>
import {useRoute, useRouter} from 'vue-router';
import {computed, onMounted, ref} from 'vue';
import {getVCDetailAPI, getVCReceiveHistoryAPI, receiveVCAPI} from '../api/vcd';
import {handleLoading} from '../utils/loading';
import {Message} from '@arco-design/web-vue';
import {useI18n} from 'vue-i18n';
import {getTrustLevelName} from '../utils/trust-level';
import moment from 'moment';

const i18n = useI18n();

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const historyLoading = ref(true);
const receiving = ref(false);

const id = ref('');
const info = ref(
    {
      'id': '',
      'name': '',
      'desc': '',
      'allowed_trust_levels': [],
      'start_time': '',
      'end_time': '',
      'created_by': '',
      'created_by_nickname': '',
      'items_count': -1,
    },
);
const loadDetail = () => {
  handleLoading(loading, true);
  getVCDetailAPI(id.value).then(
      (res) => {
        info.value = res.data;
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(loading, false);
  });
};

const historyPage = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
});
const pageChange = (page) => {
  historyPage.value.current = page;
  loadHistory();
};
const sizeChange = (size) => {
  historyPage.value.current = 1;
  historyPage.value.pageSize = size;
  loadHistory();
};
const receiveHistory = ref([]);
const receiveHistoryColumns = ref([
  {
    title: i18n.t('Receiver'),
    ellipsis: true,
    tooltip: true,
    slotName: 'receiver',
  },
  {
    title: i18n.t('TrustLevel'),
    slotName: 'trustLevel',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('ReceiveAt'),
    ellipsis: true,
    tooltip: true,
    dataIndex: 'received_at',
  },
]);
const loadHistory = () => {
  handleLoading(historyLoading, true);
  getVCReceiveHistoryAPI(id.value, historyPage.value.current, historyPage.value.pageSize).then(
      (res) => {
        receiveHistory.value = res.data.results;
        historyPage.value.total = res.data.total;
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(historyLoading, false);
  });
};

const showReceive = computed(() => {
  try {
    const now = new Date();
    const startTime = moment(info.value.start_time);
    const endTime = moment(info.value.end_time);
    return startTime.isBefore(now) && endTime.isAfter(now);
  } catch (_) {
    return false;
  }
});
const doReceive = () => {
  handleLoading(receiving, true);
  receiveVCAPI(id.value).then(
      (res) => {
        Message.success(i18n.t('Receive Success'));
        router.push({name: 'VirtualContentReceiveHistory'});
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(receiving, false);
  });
};

const isEnabled = (startTime, endTime) => {
  const now = new Date();
  startTime = moment(startTime);
  endTime = moment(endTime);
  return startTime.isBefore(now) && endTime.isAfter(now);
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
      .then(() => {
        Message.success(i18n.t('Copy Link Success'));
      })
      .catch(() => {
        Message.error(i18n.t('Copy Link Failed'));
      });
};

onMounted(() => {
  id.value = route.params.id;
  loadDetail();
  loadHistory();
});
</script>

<template>
  <div id="vc-detail">
    <a-space
      id="vc-detail-info"
      direction="vertical"
      :size="0"
    >
      <a-spin
        :loading="loading"
        style="width: 100%; display: flex; flex-direction: column"
      >
        <div id="vc-detail-title">
          {{ info.name }}
          <icon-link
            style="cursor: pointer"
            @click="copyLink"
          />
        </div>
        <a-space
          id="vc-detail-creator"
          :size="2"
        >
          <icon-user />
          {{ info.created_by_nickname ? `${info.created_by_nickname}(${info.created_by})` : info.created_by }}
        </a-space>
        <a-space
          id="vc-detail-time"
          :size="2"
        >
          <icon-share-alt />
          <a-tag v-if="info.items_count === historyPage.total">
            {{ i18n.t('NoStock') }}
          </a-tag>
          <a-tag
            v-else-if="isEnabled(info.start_time, info.end_time)"
            :color="'green'"
            size="small"
            style="padding: 0"
          >
            {{ i18n.t('Distributing') }}
          </a-tag>
          <a-tag
            v-else
            size="small"
            style="padding: 0"
          >
            {{ i18n.t('NotInTime') }}
          </a-tag>
        </a-space>
        <a-space
          id="vc-detail-time"
          :size="2"
        >
          <icon-clock-circle />
          {{ info.start_time }} - {{ info.end_time }}
        </a-space>
        <a-space
          id="vd-detail-trust-level"
          :size="2"
        >
          <icon-common />
          <template
            v-for="(l, index) in info.allowed_trust_levels"
            :key="index"
          >
            <a-tag
              size="small"
              style="padding: 0"
            >
              {{ getTrustLevelName(l) }}
            </a-tag>
          </template>
        </a-space>
        <a-space
          v-if="info.desc"
          id="vc-detail-desc"
          :size="2"
        >
          <icon-file />
          {{ info.desc }}
        </a-space>
      </a-spin>
      <a-divider />
      <a-space
        direction="vertical"
        id="vd-detail-receive-info"
      >
        <div id="vd-detail-receive-middle-head">
          <a-space
            id="vd-detail-receiver-title"
            :size="2"
          >
            <icon-user-group />
            {{ i18n.t('Receiver History') }}
            <div>
              {{ historyPage.total }}/{{ info.items_count >= 0 ? info.items_count : '-' }}
            </div>
            <icon-refresh
              @click="loadHistory"
              style="cursor: pointer"
            />
          </a-space>
          <a-button
            size="small"
            id="vd-detail-receive-button"
            :loading="receiving"
            v-show="showReceive"
            type="primary"
            @click="doReceive"
          >
            {{ i18n.t('Receive') }}
          </a-button>
        </div>
        <a-table
          :columns="receiveHistoryColumns"
          :data="receiveHistory"
          :stripe="true"
          :loading="historyLoading"
          :column-resizable="true"
          :page-position="'bottom'"
          :pagination="historyPage"
          @page-change="pageChange"
          @page-size-change="sizeChange"
        >
          <template #trustLevel="{ record }">
            {{ getTrustLevelName(record.receiver_trust_level) }}
          </template>
          <template #receiver="{ record }">
            {{ record.receiver__nickname ? `${record.receiver__nickname}(${record.receiver})` : record.receiver }}
          </template>
        </a-table>
      </a-space>
    </a-space>
  </div>
</template>

<style scoped>
#vc-detail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

#vc-detail-info {
  width: 100%;
  max-width: 600px;
  height: 100%;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--color-bg-1);
  box-shadow: var(--shadow2-center);
  border-radius: var(--border-radius-medium);
  padding: 20px;
  box-sizing: border-box;
}

#vc-detail-info > :deep(.arco-space-item) {
  width: 100%;
}

#vc-detail-title {
  word-break: break-all;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
}

#vc-detail-creator {
  word-break: break-all;
  margin: 0;
  font-weight: unset;
}

#vc-detail-time {
  word-break: break-word;
  margin-top: 10px;
}

#vd-detail-trust-level {
  margin-top: 10px;
}

#vc-detail-desc {
  margin-top: 10px;
  word-break: break-all;
}

#vd-detail-receive-info {
  width: 100%;
  word-break: break-all;
}

#vd-detail-receive-info > :deep(.arco-space-item) {
  width: 100%;
  word-break: break-all;
}

#vd-detail-receiver-title {
  word-break: break-all;
  width: 100%;
}

#vd-detail-receive-middle-head {
  display: flex;
  justify-content: space-between;
}
</style>
