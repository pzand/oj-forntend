<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, watch, withDefaults } from "vue";

interface Props {
  value: string;
  language?: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  language: "java",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditor = ref(); // monaco 实例
const codeEditorRef = ref(); // monaco 的dom引用

watch([props], () => {
  console.log(props);
});

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }

  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: props.language,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    readOnly: false,
    theme: "vs-dark",
  });

  codeEditor.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 600px; height: 90vh"
  />
</template>

<style scoped></style>
