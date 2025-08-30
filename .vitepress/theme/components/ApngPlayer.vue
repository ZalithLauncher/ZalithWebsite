<template>
  <div class="apng-player-container">
    <canvas ref="canvasRef" class="apng-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import parseAPNG from 'apng-js';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  },
  numPlays: {
    type: Number,
    default: 0
  }
});

const canvasRef = ref(null);
let apngPlayer = null;

async function getImgBuffer(url) {
  return new Promise(async resolve => {
    const blob = await fetch(url).then(res => res.blob());
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

async function createApngPlayer(url, ctx, options = {}) {
  const imgBuffer = await getImgBuffer(url);
  const apng = parseAPNG(imgBuffer);
  Object.keys(options).forEach(key => {
    apng[key] = options[key];
  });
  const player = await apng.getPlayer(ctx);
  return player;
}

async function initApngPlayer() {
  if (!canvasRef.value) return;

  canvasRef.value.width = props.width;
  canvasRef.value.height = props.height;
  const ctx = canvasRef.value.getContext('2d');

  apngPlayer = await createApngPlayer(props.src, ctx, {
    numPlays: props.numPlays
  });

  apngPlayer.play();
}

watch(
  () => props.src,
  async newSrc => {
    if (apngPlayer) {
      apngPlayer.stop();
    }
    await initApngPlayer();
  }
);

onMounted(async () => {
  await initApngPlayer();
});
</script>

<style scoped>
.apng-player-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.apng-canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
