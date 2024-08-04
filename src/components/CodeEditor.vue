<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, withDefaults } from "vue";

interface Props {
  value: string;
  handleChange: (v: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditor = ref(); // monaco 实例
const codeEditorRef = ref(); // monaco 的dom引用

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }

  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    automaticLayout: true,
    minimap: {
      enabled: true,
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
  <div id="code-editor" ref="codeEditorRef" style="min-height: 400px" />
</template>

<style scoped></style>
