<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="标题" style="min-width: 300px">
        <a-input v-model="searchParams.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 300px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">Submit</a-button>
      </a-form-item>
    </a-form>

    <a-divider size="0" />

    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
        showTotal: true,
      }"
      @page-change="onPageChange"
    >
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum ? record.acceptedNum / record.submitNum : "0"
          }% (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref<QuestionVO[]>([]);
const total = ref<number>(0);
const searchParams = ref<QuestionQueryRequest>({
  tags: [],
  title: "",
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPage(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records ?? [];
    total.value = res.data?.total ?? 0;
  } else {
    Message.error("加载失败" + res.message);
  }
};

// watchEffect 如果钩子中的内容发生改变时触发。仅仅限于最外层，不是深层监听，而是浅监听
// 不执行动态加载
// watch(searchParams.value, () => {
//   loadData();
// });

// watchEffect(() => {
//   loadData();
// });

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "标题名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
  },
];

const onPageChange = (num: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: num,
  };
};

const router = useRouter();
const toQuestionPage = (record: Question) => {
  router.push({
    path: `/view/question/${record.id}`,
  });
};

const doSubmit = () => {
  // 需要重置搜索页号
  searchParams.value.current = 1;
  loadData();
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
