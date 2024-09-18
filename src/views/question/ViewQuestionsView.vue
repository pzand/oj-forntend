<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目">
            <a-card :title="question?.title">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig?.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="空间限制">
                  {{ question.judgeConfig?.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig?.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question?.content || ''" />
              <template #extra>
                <a-space>
                  <a-tag
                    v-for="(tag, index) of question?.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论">
            Content of Tab Panel 2
          </a-tab-pane>
          <a-tab-pane key="answer" title="答案">
            Content of Tab Panel 3
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item field="title" label="编程语言" style="min-width: 300px">
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="请选择编程语言"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />
        <a-button type="primary" @click="doSubmit"> 提交</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const question = ref<QuestionVO>({});

interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
});
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoById(props.id);
  if (res.code === 0) {
    question.value = res?.data ?? {};
  } else {
    Message.error("加载失败" + res.message);
  }
};

const doSubmit = async () => {
  if (!props.id) {
    return;
  }

  const res = await QuestionSubmitControllerService.doQuestionSubmit({
    ...form.value,
    questionId: props.id,
  });
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const changeCode = (s: string) => {
  form.value.code = s;
};
</script>

<style scoped>
#viewQuestionView {
  margin: 0 auto;
}
</style>
