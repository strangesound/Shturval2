<template>
  <div class="wrapper">
    <video ref="screenSaverVideo" class="screenSaverVideo" muted loop autoplay playsinline
      src="/video/screenSaver.mp4"></video>
    <ScreenSaver v-if="showScreenSaver" />
    <div class="map-container" v-if="!showScreenSaver">
      <img class="map" src="/images/main/map.webp" alt="map">
      <div v-if="currentPoint && !showGame" :style="pointStyle" class="point">
        <div class="tooltip">{{ currentPoint.landmark }}</div>
      </div>
      <Rumba :point="currentPoint" />
    </div>
    <Transition>
      <ShipGame v-if="showGame" :point="currentPoint" />
    </Transition>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import shturval from '@/store';
import points from '@/assets/json/points.json';
import ScreenSaver from '@/components/ScreenSaver.vue';
import Rumba from '@/components/Rumba.vue';
import ShipGame from '@/components/ShipGame.vue';
import { states, currentState, setState } from '@/states'; // Импортируем константы и функцию

const currentPointIndex = ref(0);
const showGame = ref(false);
const showScreenSaver = ref(false);
const currentPoint = computed(() => points[currentPointIndex.value]);

let showGameTimeout
let idleTimer;


const screenSaverVideo = ref(null);

function resetIdleTimer() {
  clearTimeout(idleTimer);
  console.log('Timer reset at:', new Date().toISOString());

  idleTimer = setTimeout(() => {
    setState(states.SCREENSAVER);
    clearTimeout(showGameTimeout);
    showScreenSaver.value = true;
    showGame.value = false;
  }, 90000);
}


function enterPointInfo() {
  setState(states.POINT_INFO);
  showGame.value = true;

}


// Обработка изменения текущего значения штурвала
watch(() => shturval.currentValue, (newValue, oldValue) => {
  resetIdleTimer();
  const difference = newValue - oldValue;

  switch (currentState.value) {
    case states.MAP:
      showGame.value = false
      showScreenSaver.value = false
      if (difference > 10) {
        currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 5000);

      } else if (difference < -10) {
        currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 5000);
      }
      break;

    case states.POINT_INFO:
      break;

    case states.SCREENSAVER:
      if (difference > 10 || difference < -10) {
        setState(states.MAP);
      }
  }
});



watch(showGame, (newValue) => {
  if (screenSaverVideo.value) {
    if (newValue === true) {
      screenSaverVideo.value.pause();
    } else {
      screenSaverVideo.value.play();
    }
  }
});



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
  background-color: rgba(0, 0, 0, 0.6);
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
  z-index: 2;
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

.screenSaverVideo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>