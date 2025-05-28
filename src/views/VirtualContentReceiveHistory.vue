<script setup>
import {useI18n} from 'vue-i18n';
import {onMounted, ref} from 'vue';
import {listReceiveHistoryAPI} from '@/api/vcd';
import {Message, Modal} from '@arco-design/web-vue';
import {handleLoading} from '@/utils/loading';
import {useRouter} from 'vue-router';

const router = useRouter();

const i18n = useI18n();

const loading = ref(true);

const title = ref(`${i18n.t('Receive History')} - ${i18n.t('LinuxDoVCD')}`);
document.title = title.value;

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
const columns = ref([
  {
    title: i18n.t('Project'),
    dataIndex: 'virtual_content_name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('ReceiveAt'),
    dataIndex: 'received_at',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('Operation'),
    slotName: 'operation',
    width: 80,
  },
]);
const history = ref([]);
const loadHistory = () => {
  handleLoading(loading, true);
  listReceiveHistoryAPI(historyPage.value.current, historyPage.value.pageSize).then(
      (res) => {
        history.value = res.data.results;
        historyPage.value.total = res.data.total;
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(loading, false);
  });
};

const goToDetail = (id) => {
  router.push({name: 'VirtualContentDetail', params: {id: id}});
};

const showData = (title, data) => {
  Modal.info({
    title: title,
    content: data,
    modalStyle: {width: '600px', maxWidth: 'calc(100% - 40px)', boxSizing: 'border-box'},
    okText: i18n.t('OneClickCopy'),
    onOk: () => {
      navigator.clipboard.writeText(data)
          .then(() => {
            Message.success(i18n.t('Copy Success'));
          })
          .catch(() => {
            Message.error(i18n.t('Copy Failed'));
          });
    },
    cancelText: i18n.t('Close'),
    hideCancel: false,
    simple: true,
  });
};

onMounted(() => {
  loadHistory();
});
</script>

<template>
  <div id="vc-r-history">
    <a-space
      id="vc-r-history-info"
      direction="vertical"
      :size="0"
    >
      <div id="vc-r-history-title">
        {{ i18n.t('Receive History') }}
      </div>
      <a-table
        :columns="columns"
        :data="history"
        :stripe="false"
        :loading="loading"
        :column-resizable="true"
        :page-position="'bottom'"
        :pagination="historyPage"
        @page-change="pageChange"
        @page-size-change="sizeChange"
        :scroll="{maxHeight: 'min(calc(100 * var(--vh) - 240px), 470px)'}"
      >
        <template #operation="{ record }">
          <a-space>
            <a-button
              size="mini"
              type="text"
              style="padding: 0"
              @click="goToDetail(record.virtual_content)"
            >
              <icon-launch />
            </a-button>
            <a-button
              size="mini"
              type="text"
              style="padding: 0"
              @click="showData(record.virtual_content_name, record.virtual_content_item_content)"
            >
              <icon-file />
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>

<style scoped>
#vc-r-history {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

#vc-r-history-info {
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

#vc-detail-info > :deep(.arco-space-item) {
  width: 100%;
}

#vc-r-history-title {
  color: var(--color-text-1);
  text-align: center;
  word-break: break-all;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: bold;
}

#vc-r-history table {
  table-layout: auto;
}
</style>
