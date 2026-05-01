<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(async () => {
  await nextTick();

  if (typeof window !== 'undefined') {
    const twikoo = await import('twikoo');
    twikoo.init({
      envId: 'https://comment.miawa.cn',
      el: '#tcomment',
    });
  }
});
</script>

<template>
  <div id="tcomment"></div>
</template>
