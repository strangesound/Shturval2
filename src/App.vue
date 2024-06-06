<template>
  <div class="wrapper">
    <!-- <div class="last-time">{{ lastInteractionTime }}</div> -->
    <Transition>
      <ScreenSaver v-if="showScreenSaver" />
    </Transition>
    <img class="map" src="/images/main/map.webp" alt="map">
    <div v-if="currentPoint && !showGame" :style="pointStyle" class="point">
      <div class="tooltip">{{ currentPoint.landmark }}</div>
    </div>
    <Transition>
      <ShipGame v-if="showGame" :point="currentPoint" />
    </Transition>

    <Rumba :point="currentPoint" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import shturval from '@/store';
import points from '@/assets/json/points.json'; // Импорт JSON файла
import ScreenSaver from '@/components/ScreenSaver.vue';
import PointInfo from '@/components/PointInfo.vue';
import Rumba from '@/components/Rumba.vue';
import ShipGame from '@/components/ShipGame.vue';
import { states, currentState, setState } from '@/states'; // Импортируем константы и функцию

const currentPointIndex = ref(0);
const showGame = ref(false);
const showScreenSaver = ref(false);
const currentPoint = computed(() => points[currentPointIndex.value]);
let lastInteractionTime = Date.now();
let interactionBlocked = false;
let showGameTimeout

setState(states.MAP)


function enterPointInfo() {
  setState(states.POINT_INFO);
  showGame.value = true;

}


// Обработка изменения текущего значения штурвала
watch(() => shturval.currentValue, (newValue, oldValue) => {
  lastInteractionTime = Date.now();
  const difference = newValue - oldValue;

  switch (currentState.value) {
    case states.MAP:
      showGame.value = false
      showScreenSaver.value = false
      if (difference > 10) {
        currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 3000);

      } else if (difference < -10) {
        currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 3000);
      }
      break;

    case states.POINT_INFO:
      break;

    case states.SCREENSAVER:

      clearTimeout(showGameTimeout)
      showGame.value = false
      if (!showScreenSaver.value) {
        showScreenSaver.value = true
      }

      if (difference > 10 || difference < -10) {
        setState(states.MAP);
      }
      break;
  }
});


// Включение скринсейвера через 20 секунд бездействия
setInterval(() => {
  if (Date.now() - lastInteractionTime > 600000 && currentState.value !== states.SCREENSAVER) {
    console.log('setInterval hello');
    console.log('Date.now()', Date.now());
    console.log('lastInteractionTime', lastInteractionTime);
    console.log('currentState.value', currentState.value);
    setState(states.SCREENSAVER)
    showScreenSaver.value = true;
    showGame.value = false;

  }
}, 1000);




const pointStyle = computed(() => {
  if (!currentPoint.value) return {};
  return {
    position: 'absolute',
    left: `${currentPoint.value.x}px`,
    top: `${currentPoint.value.y}px`,
    transform: 'translate(-50%, -130%)',
    textAlign: 'center',
  };
});
</script>

<style scoped>
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
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
  background: url('/images/main/btn.webp') no-repeat center center;
  width: 21.667vw;
  height: 3.828vw;
  color: black;
  text-align: center;
  font-size: 1.042vw;
  line-height: 1;
}

.last-time {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 2vw;
  background-color: black;
  z-index: 99999999999;
}
</style>