<script setup>
import { ref, watch } from 'vue';
import state from '@/store';
import ScreenSaver from './components/ScreenSaver.vue';
import Map from './components/Map.vue';

const showMap = ref(false);
let previousValue = state.currentValue;

watch(
  () => state.currentValue,
  (newValue) => {
    if (Math.abs(newValue - previousValue) > 10) {
      showMap.value = true;
    }
    previousValue = newValue;
  }
);
</script>

<template>
  <main>
    <div class="cv">{{ state.currentValue }}</div>
    <component :is="showMap ? Map : ScreenSaver" />
  </main>
</template>

<style scoped>
.cv {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1vw;
  z-index: 99999;
  background-color: black;
  color: white;
  padding: 1vw;
  opacity: .2;
}
</style>