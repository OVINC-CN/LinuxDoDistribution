<script setup>
import {useI18n} from 'vue-i18n';
import {onMounted, ref} from 'vue';
import {handleLoading} from '@/utils/loading';
import {createVCAPI, deleteVCAPI, listVCHistoryAPI, updateVCAPI} from '@/api/vcd';
import {Message} from '@arco-design/web-vue';
import moment from 'moment';
import {useRouter} from 'vue-router';

const loading = ref(true);

const router = useRouter();

const i18n = useI18n();

const title = ref(`${i18n.t('DistributeHistory')} - ${i18n.t('LinuxDoVCD')}`);
document.title = title.value;

const historyPage = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  simple: true,
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
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: i18n.t('Status'),
    slotName: 'status',
    width: 80,
  },
  {
    title: i18n.t('Operation'),
    slotName: 'operation',
    width: 120,
  },
]);
const history = ref([]);
const loadHistory = () => {
  handleLoading(loading, true);
  listVCHistoryAPI(historyPage.value.current, historyPage.value.pageSize).then(
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

const isEnabled = (startTime, endTime) => {
  const now = new Date();
  startTime = moment(startTime);
  endTime = moment(endTime);
  return startTime.isBefore(now) && endTime.isAfter(now);
};

const goToDetail = (id) => {
  router.push({name: 'VirtualContentDetail', params: {id: id}});
};

const deleting = ref(false);
const deleteVC = (id) => {
  handleLoading(deleting, true);
  deleteVCAPI(id).then(
      () => {
        loadHistory();
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(deleting, true);
  });
};

const drawerLoading = ref(false);
const drawerVisible = ref(false);
const formData = ref({
  name: '',
  desc: '',
  allowed_trust_levels: [],
  allowed_users: [],
  allow_same_ip: true,
  show_receiver: false,
  start_time: '',
  end_time: '',
  items: '',
  extra_items: '',
});
const formDataRules = ref({
  name: [
    {required: true, message: i18n.t('NameRequired')},
  ],
  desc: [],
  allowed_trust_levels: [
    {required: true, message: i18n.t('TrustLevelRequired')},
    {minLength: 1, message: i18n.t('TrustLevelRequired')},
  ],
  allow_same_ip: [
    {required: true, message: i18n.t('AllowSameIPRequired')},
  ],
  show_receiver: [
    {required: true, message: i18n.t('ShowReceiverRequired')},
  ],
  start_time: [
    {required: true, message: i18n.t('StartTimeRequired')},
  ],
  end_time: [
    {required: true, message: i18n.t('EndTimeRequired')},
  ],
  items: [
    {required: true, message: i18n.t('ItemRequired')},
    {minLength: 1, message: i18n.t('ItemRequired')},
  ],
});
const showDrawer = (isEdit, data) => {
  drawerVisible.value = true;
  if (isEdit) {
    formData.value = JSON.parse(JSON.stringify(data));
  } else {
    const now = moment();
    const endTime = moment();
    endTime.add(7, 'd');
    formData.value = {
      name: '',
      desc: '',
      allowed_trust_levels: [],
      allowed_users: [],
      allow_same_ip: true,
      show_receiver: false,
      start_time: now,
      end_time: endTime,
      items: '',
      extra_items: '',
    };
  }
};
const hideDrawer = () => {
  drawerVisible.value = false;
};
const doSubmit = ({values, errors}) => {
  if (errors) {
    return;
  }
  handleLoading(drawerLoading, true);
  const data = JSON.parse(JSON.stringify(values));
  if (data.id) {
    if (data.extra_items) {
      data.extra_items = data.extra_items.split(/\r?\n/).filter((line) => line.trim() !== '');
    } else {
      data.extra_items = [];
    }
    updateVCAPI(data.id, data).then(
        () => {
          hideDrawer();
          loadHistory();
        },
        (err) => {
          Message.error(err.response.data.message);
        },
    ).finally(() => {
      handleLoading(drawerLoading, false);
    });
    return;
  }
  data.items = data.items.split(/\r?\n/).filter((line) => line.trim() !== '');
  createVCAPI(data).then(
      () => {
        hideDrawer();
        loadHistory();
      },
      (err) => {
        Message.error(err.response.data.message);
      },
  ).finally(() => {
    handleLoading(drawerLoading, false);
  });
};

onMounted(() => {
  loadHistory();
});
</script>

<template>
  <div id="vc-share">
    <a-space
      id="vc-share-info"
      direction="vertical"
      :size="0"
    >
      <div class="vc-share-title">
        {{ i18n.t('DistributeHistory') }}
      </div>
      <a-button
        style="margin-bottom: 10px"
        size="small"
        type="primary"
        @click="showDrawer(false, {})"
      >
        {{ i18n.t('CreateDistribute') }}
      </a-button>
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
        :scroll="{maxHeight: 'min(calc(100 * var(--vh) - 284px), 430px)'}"
      >
        <template #status="{ record }">
          <a-tag
            v-if="isEnabled(record.start_time, record.end_time)"
            :color="'green'"
            size="small"
          >
            {{ i18n.t('Distributing') }}
          </a-tag>
          <a-tag
            v-else
            size="small"
          >
            {{ i18n.t('NotInTime') }}
          </a-tag>
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
            <a-button
              size="mini"
              type="text"
              style="padding: 0"
              @click="showDrawer(true, record)"
            >
              <icon-edit />
            </a-button>
            <a-button
              size="mini"
              type="text"
              style="padding: 0"
              @click="deleteVC(record.id)"
              status="danger"
            >
              <icon-delete />
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
  <a-drawer
    :width="600"
    :visible="drawerVisible"
    :footer="false"
    @cancel="hideDrawer"
    unmount-on-close
    :drawer-style="{maxWidth: '100%'}"
  >
    <template #title>
      {{ formData.id ? i18n.t('EditDistribute') : i18n.t('CreateDistribute') }}
    </template>
    <a-form
      :model="formData"
      auto-label-width
      :rules="formDataRules"
      @submit="doSubmit"
      :disabled="drawerLoading"
    >
      <a-form-item
        :label="i18n.t('Name')"
        field="name"
      >
        <a-input
          v-model="formData.name"
          :max-length="32"
          show-word-limit
        />
      </a-form-item>
      <a-form-item
        :label="i18n.t('Description')"
        field="desc"
      >
        <a-textarea
          v-model="formData.desc"
          :max-length="1024"
          show-word-limit
          :auto-size="{ minRows:1,maxRows:5}"
        />
      </a-form-item>
      <a-form-item
        :label="i18n.t('AllowedTrustLevels')"
        field="allowed_trust_levels"
      >
        <a-select
          multiple
          v-model="formData.allowed_trust_levels"
          :allow-search="false"
        >
          <a-option :value="0">
            {{ i18n.t('New User') }}
          </a-option>
          <a-option :value="1">
            {{ i18n.t('Basic User') }}
          </a-option>
          <a-option :value="2">
            {{ i18n.t('User') }}
          </a-option>
          <a-option :value="3">
            {{ i18n.t('Active User') }}
          </a-option>
          <a-option :value="4">
            {{ i18n.t('Leader') }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="i18n.t('Allowed Users')"
        field="allowed_users"
      >
        <a-space
          direction="vertical"
          style="width: 100%"
        >
          <a-input-tag v-model="formData.allowed_users" />
          <div style="font-size: 12px; color: var(--color-text-2)">
            {{ i18n.t('AllowedUsersTips') }}
          </div>
        </a-space>
      </a-form-item>
      <a-form-item
        :label="i18n.t('IP Control')"
        field="allow_same_ip"
      >
        <a-space
          direction="vertical"
          style="width: 100%"
        >
          <a-radio-group
            type="button"
            v-model="formData.allow_same_ip"
          >
            <a-radio :value="true">
              {{ i18n.t('AllowSameIP') }}
            </a-radio>
            <a-radio :value="false">
              {{ i18n.t('DenySameIP') }}
            </a-radio>
          </a-radio-group>
          <div style="font-size: 12px; color: var(--color-text-2)">
            {{ i18n.t('AllowSameIPTips') }}
          </div>
        </a-space>
      </a-form-item>
      <a-form-item
        :label="i18n.t('Receiver Privacy')"
        field="show_receiver"
      >
        <a-space
          direction="vertical"
          style="width: 100%"
        >
          <a-radio-group
            type="button"
            v-model="formData.show_receiver"
          >
            <a-radio :value="true">
              {{ i18n.t('ShowReceiverName') }}
            </a-radio>
            <a-radio :value="false">
              {{ i18n.t('HideReceiverName') }}
            </a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>
      <a-form-item
        :label="i18n.t('StartTime')"
        field="start_time"
      >
        <a-date-picker
          v-model="formData.start_time"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :label="i18n.t('EndTime')"
        field="end_time"
      >
        <a-date-picker
          v-model="formData.end_time"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :label="i18n.t('Items')"
        field="items"
        v-if="!formData.id"
      >
        <a-textarea
          v-model="formData.items"
          show-time
          style="width: 100%"
          :placeholder="i18n.t('ItemsInputTip')"
          :auto-size="{minRows:3, maxRows:20}"
        />
      </a-form-item>
      <a-form-item
        :label="i18n.t('AppendItems')"
        field="extra_items"
        v-else
      >
        <a-space
          direction="vertical"
          :size="0"
          style="width: 100%"
        >
          <a-textarea
            v-model="formData.extra_items"
            show-time
            style="width: 100%"
            :placeholder="i18n.t('ItemsInputTip')"
            :auto-size="{minRows:3, maxRows:20}"
          />
          <div style="font-size: 12px; color: var(--color-text-2)">
            {{ i18n.t('AppendItemsTips') }}
          </div>
        </a-space>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            size="small"
            @click="hideDrawer"
            :loading="drawerLoading"
          >
            {{ i18n.t('Cancel') }}
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            size="small"
            :loading="drawerLoading"
          >
            {{ i18n.t('Submit') }}
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<style scoped>
#vc-share {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}

#vc-share-info {
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

#vc-share-info > :deep(.arco-space-item) {
  width: 100%;
}

.vc-share-title {
  color: var(--color-text-1);
  text-align: center;
  word-break: break-all;
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: bold;
}
</style>
