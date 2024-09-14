<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="title" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>

      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              class="input-demo"
              :min="0"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              class="input-demo"
              :min="0"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              class="input-demo"
              :min="0"
            />
          </a-form-item>
        </a-space>
      </a-form-item>

      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :field="`form.judgeCase[${index}]`"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 500px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例 ${index}`"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例 ${index}`"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)"
              >删除
            </a-button>
          </a-space>
        </a-form-item>
        <div>
          <a-button
            type="outline"
            @click="handleAdd"
            status="success"
            style="margin-top: 32px"
            >添加测试用例
          </a-button>
        </div>
      </a-form-item>

      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const updatePage: boolean = route.path.includes("update");

const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionById(id as never);
  if (res.code === 0) {
    form = reactive(Object.assign(form, res.data));
    form.tags = JSON.parse(res.data?.tags ?? "[]");
    form.judgeCase = JSON.parse(res.data?.judgeCase ?? "[]");
    form.judgeConfig = JSON.parse(res.data?.judgeConfig ?? "[]");
  } else {
    Message.error("获取数据失败" + res.message);
  }
};

onMounted(() => {
  if (updatePage) {
    loadData();
  }
});

let form = reactive({
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  tags: [],
  title: "",
});

const doSubmit = async () => {
  console.log(form);
  if (updatePage) {
    const res = await QuestionControllerService.editQuestion(form);
    if (res.code === 0) {
      Message.success("更新成功");
    } else {
      Message.error("更新失败" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestion(form);
    if (res.code === 0) {
      Message.success("创建成功");
    } else {
      Message.error("创建失败" + res.message);
    }
  }
};

const onContentChange = (v: string) => {
  form.content = v;
};
const onAnswerChange = (v: string) => {
  form.answer = v;
};

const handleAdd = () => {
  form?.judgeCase?.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form?.judgeCase?.splice(index, 1);
};
</script>

<style scoped>
#addQuestionView {
}
</style>
