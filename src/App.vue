<template>
  <div v-if="showScreenSaver" class="wrapper">
    <ScreenSaver />
  </div>
  <div v-else class="wrapper">
    <img class="map" src="/images/main/map.png" alt="map">
    <div v-if="currentPoint && !showInfo" :style="pointStyle" class="point">
      <div class="tooltip">{{ currentPoint.landmark }}</div>
    </div>
    <PointInfo v-if="showInfo" :point="currentPoint" @hide="handleHidePointInfo" />
    <Rumba :point="currentPoint"/>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import state from '@/store';
import points from '@/assets/json/points.json'; // Импорт JSON файла
import ScreenSaver from '@/components/ScreenSaver.vue';
import PointInfo from '@/components/PointInfo.vue';
import Rumba from '@/components/Rumba.vue';

const showInfo = ref(false);
const showScreenSaver = ref(false);
const currentPointIndex = ref(0);
const currentPoint = computed(() => points[currentPointIndex.value]);
let lastInteractionTime = Date.now();
let interactionBlocked = false;

watch(
  () => state.currentValue,
  (newValue, oldValue) => {
    lastInteractionTime = Date.now();
    const difference = newValue - oldValue;
    if (!interactionBlocked && difference > 10) {
      currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
    } else if (!interactionBlocked && difference < -10) {
      currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
    }
    if (!interactionBlocked && !showInfo) {
      showInfo.value = true;
    } else if (showInfo && interactionBlocked && (difference > 10 || difference < -10)) {
      handleHidePointInfo();
    }
  }
);

const handleHidePointInfo = () => {
  showInfo.value = false;
  interactionBlocked = false;
};

const checkInactivity = () => {
  if (Date.now() - lastInteractionTime > 2000000) { // 20 секунд бездействия
    showScreenSaver.value = true;
  } else {
    showScreenSaver.value = false;
  }
};

setInterval(checkInactivity, 1000); // Проверяем каждые 1 секунду

const pointStyle = computed(() => {
  if (!currentPoint.value) return {};
  return {
    position: 'absolute',
    left: `${currentPoint.value.x}px`,
    top: `${currentPoint.value.y}px`,
    transform: 'translate(-50%, -130%)',
    color: 'white',
    backgroundColor: 'red',
    padding: '5px',
    borderRadius: '50%',
    textAlign: 'center',
  };
});
</script>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
  color: white;
}

.map {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

.point {
  position: absolute;
  transform: translate(-50%, -50%);
}

.tooltip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/images/main/btn.png') no-repeat center center;
  width: 21.667vw;
  height: 3.828vw;
  color: black;
  text-align: center;
  font-size: 1.042vw;
  line-height: 1;
}
</style>