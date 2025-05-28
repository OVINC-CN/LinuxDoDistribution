<script setup>
import {useI18n} from 'vue-i18n';
import {onMounted, ref} from 'vue';
import {listVCPublicAPI} from '@/api/vcd';
import {Message} from '@arco-design/web-vue';
import {useRouter} from 'vue-router';
import {handleLoading} from '@/utils/loading';

const i18n = useI18n();

const loading = ref(false);

// title
const title = ref(i18n.t('LinuxDoVCD'));
document.title = title.value;

// route
const router = useRouter();
const goToDetail = (id) => {
  router.push({name: 'VirtualContentDetail', params: {id: id}});
};

// vc
const page = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  simple: true,
});
const pageChange = (page) => {
  page.value.current = page;
  loadVirtualContents();
};
const sizeChange = (size) => {
  page.value.current = 1;
  page.value.pageSize = size;
  loadVirtualContents();
};
const columns = ref([
  {
    title: i18n.t('Project'),
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('Creator'),
    slotName: 'creator',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('Operation'),
    slotName: 'operation',
    width: 60,
  },
]);
const virtualContents = ref([]);
const loadVirtualContents = () => {
  handleLoading(loading, true);
  listVCPublicAPI(page.value.current, page.value.pageSize).then(
      (res) => {
        virtualContents.value = res.data.results;
        page.value.total = res.data.total;
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(loading, false);
  });
};
onMounted(() => {
  loadVirtualContents();
});
</script>

<template>
  <div id="home">
    <a-spin :loading="loading">
      <a-space
        id="home-space"
        direction="vertical"
        v-if="virtualContents.length === 0"
      >
        <h2 id="home-space-title">
          {{ i18n.t("LinuxDoVCD") }}
        </h2>
      </a-space>
      <a-space
        id="home-share"
        direction="vertical"
        :size="0"
        v-else
      >
        <div class="home-share-title">
          {{ i18n.t('SharingProjects') }}
        </div>
        <a-table
          :columns="columns"
          :data="virtualContents"
          :stripe="false"
          :column-resizable="true"
          :page-position="'bottom'"
          :pagination="page"
          @page-change="pageChange"
          @page-size-change="sizeChange"
          :scroll="{maxHeight: 'min(calc(100 * var(--vh) - 240px), 470px)'}"
        >
          <template #creator="{ record }">
            {{ record.created_by_nickname ? `${record.created_by_nickname}(${record.created_by})` : record.created_by }}
          </template>
          <template #operation="{ record }">
            <a-space>
              <a-button
                size="mini"
                type="text"
                style="padding: 0"
                @click="goToDetail(record.id)"
              >
                <icon-launch />
              </a-button>
            </a-space>
          </template>
        </a-table>
      </a-space>
    </a-spin>
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
