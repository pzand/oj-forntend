<template>
  <div id="questionsSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 300px">
        <a-input v-model="searchParams.questionId" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 300px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="请选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
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
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";

const dataList = ref<QuestionVO[]>([]);
const total = ref<number>(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  language: undefined,
  questionId: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitVoByPage({
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.code === 0) {
    dataList.value = res?.data?.records ?? [];
    total.value = res.data?.total ?? 0;
    console.log(total.value);
  } else {
    Message.error("加载失败: " + res.message);
  }
};

// watchEffect 如果钩子中的内容发生改变时触发。仅仅限于最外层，不是深层监听，而是浅监听
// 执行动态加载
watchEffect(loadData);

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "提交者 id",
    dataIndex: "status",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

const onPageChange = (num: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: num,
  };
};

const router = useRouter();
onMounted(() => {
  let loginUser = store.state.user.loginUser;

  // 如果没有用户信息，尝试获取用户信息，实现自动登录
  if (
    !loginUser ||
    !loginUser.userRole ||
    loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
  ) {
    router.push({
      path: "/user/login?redirect=${to.fullPath}",
    });
  }
});

const doSubmit = () => {
  // 需要重置搜索页号
  searchParams.value.current = 1;
  loadData();
};
</script>

<style scoped>
#questionsSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
