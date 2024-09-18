<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { Viewer } from "@bytemd/vue-next";
import { withDefaults, defineProps } from "vue";

const plugins = [gfm(), highlight()];

interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
});
</script>

<style></style>
