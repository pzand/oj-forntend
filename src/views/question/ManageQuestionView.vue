<template>
  <div id="manageQuestionView">
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
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

const dataList = ref<Question[]>([]);
const total = ref<number>(0);
const searchParams = ref<QuestionQueryRequest>({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPage(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records ?? [];
    total.value = res.data?.total ?? 0;
  } else {
    Message.error("加载失败" + res.message);
  }
};

watchEffect(() => {
  loadData();
});

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "用户id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
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
const doUpdate = (record: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: record.id,
    },
  });
};

const doDelete = async (record: Question) => {
  const res = await QuestionControllerService.deleteQuestion({ id: record.id });
  if (res.code === 0) {
    Message.success("删除成功");
    await loadData();
  } else {
    Message.error("删除失败" + res.code);
  }
};
</script>

<style scoped>
#manageQuestionView {
}
</style>
