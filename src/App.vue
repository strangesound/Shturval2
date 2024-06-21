<template>
  <div class="wrapper">

    <div class="tech tech-buttons">
      <button @click="switchToScreensaver" class="set-screensaver">set-screensaver</button>
      <button @click="switchToMap" class="set-map">set-map</button>
    </div>

    <Transition>
      <ScreenSaver v-if="showScreenSaver" />
    </Transition>

    <Transition>
      <Map v-if="!showScreenSaver" :point="currentPoint" :showGame="showGame" />
    </Transition>

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
import Map from '@/components/Map.vue';

import ShipGame from '@/components/ShipGame.vue';
import { states, currentState, setState, isInteractionBlocked } from '@/states';

const currentPointIndex = ref(0);
const showGame = ref(false);
const showScreenSaver = ref(false);
const currentPoint = computed(() => points[currentPointIndex.value]);

let showGameTimeout
let idleTimer;



function resetIdleTimer() {
  clearTimeout(idleTimer);
  // console.log('Timer reset at:', new Date().toISOString());

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

      if (isInteractionBlocked()) {
        return;
      }

      if (difference > 10) {
        currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 3500);

      } else if (difference < -10) {
        currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
        clearTimeout(showGameTimeout)
        showGameTimeout = setTimeout(enterPointInfo, 3500);
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

// Only for test!!!

function switchToMap() {
  setState(states.MAP);
  showGame.value = false;
  showScreenSaver.value = false;
  console.log('Switched to MAP state');
}

function switchToScreensaver() {
  setState(states.SCREENSAVER);
  clearTimeout(showGameTimeout)
  showGame.value = false;
  showScreenSaver.value = true;
  console.log('Switched to SCREENSAVER state');
}




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

.map-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow: hidden;
  opacity: 1;
  transition: opacity .3s;


}

.map {
  width: 110vw;
  height: 110vh;
  object-fit: cover;
  position: absolute;
  top: -5vh;
  left: -5vw;
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



.tech-buttons {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
}

.tech-buttons>button {
  font-size: 1vw;
  width: 100%;
  margin: .3vw;
  padding: .3vw;
  opacity: .5;
}
</style>