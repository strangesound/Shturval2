<template>
  <div class="wrapper">

    <ShipGame />
    <ScreenSaver v-if="showScreenSaver" />
    <img class="map" src="/images/main/map.png" alt="map">
    <div v-if="currentPoint && !showInfo" :style="pointStyle" class="point">
      <div class="tooltip">{{ currentPoint.landmark }}</div>
    </div>
    <PointInfo v-if="showInfo" :point="currentPoint" @hide="handleHidePointInfo" />
    <Rumba :point="currentPoint" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import state from '@/store';
import points from '@/assets/json/points.json'; // Импорт JSON файла
import ScreenSaver from '@/components/ScreenSaver.vue';
import PointInfo from '@/components/PointInfo.vue';
import Rumba from '@/components/Rumba.vue';
import ShipGame from '@/components/ShipGame.vue';


// Определение состояний
const states = {
  MAP: 'map',
  POINT_INFO: 'point_info',
  SCREENSAVER: 'screensaver'
};



const currentState = ref(states.MAP);

const currentPointIndex = ref(0);
const showInfo = ref(false);
const showScreenSaver = ref(false);
const currentPoint = computed(() => points[currentPointIndex.value]);
let lastInteractionTime = Date.now();
let interactionBlocked = false;
let pointInfoTimeout = null;
let showInfoTimeout

// Функция для изменения состояния
const changeState = (newState) => {
  currentState.value = newState;
  updateLastInteractionTime(); // Обновляем время последнего взаимодействия при смене состояния
};


// Пример функции для входа в состояние PointInfo
const enterPointInfo = () => {
  changeState(states.POINT_INFO);
  showInfo.value = true;
  interactionBlocked = true;
  pointInfoTimeout = setTimeout(() => {
    interactionBlocked = false;
  }, 7000); // 7 секунд блокировки взаимодействия
};


// Обработка изменения текущего значения штурвала
watch(() => state.currentValue, (newValue, oldValue) => {
  lastInteractionTime = Date.now();
  const difference = newValue - oldValue;

  switch (currentState.value) {
    case states.MAP:
      if (difference > 10) {
        currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
        clearTimeout(showInfoTimeout)
        showInfoTimeout = setTimeout(enterPointInfo, 3000);

      } else if (difference < -10) {
        currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
        clearTimeout(showInfoTimeout)
        showInfoTimeout = setTimeout(enterPointInfo, 3000);
      }
      break;

    case states.POINT_INFO:
      if (!interactionBlocked && (difference > 10 || difference < -10)) {
        changeState(states.MAP);
        showInfo.value = false;
      }
      break;

    case states.SCREENSAVER:
      if (difference > 10 || difference < -10) {
        changeState(states.MAP);
      }
      break;
  }
});




// Обновление времени последнего взаимодействия
const updateLastInteractionTime = () => {
  lastInteractionTime = Date.now();
};

const handleHidePointInfo = () => {
  showInfo.value = false;
  interactionBlocked = false;
};

// Включение скринсейвера через 20 секунд бездействия
setInterval(() => {
  if (Date.now() - lastInteractionTime > 20000 && currentState.value === states.MAP) {
    changeState(states.SCREENSAVER);
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
  background: url('/images/main/btn.png') no-repeat center center;
  width: 21.667vw;
  height: 3.828vw;
  color: black;
  text-align: center;
  font-size: 1.042vw;
  line-height: 1;
}
</style>