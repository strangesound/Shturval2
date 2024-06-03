<template>
    <div class="wrapper">
        <img class="map" src="/images/map.jpg" alt="map">
        <div v-if="currentPoint" :style="pointStyle" class="point">
            <div class="tooltip">
                <p class="">{{ currentPoint.city }}</p>
                <p class="">{{ currentPoint.landmark }}</p>

            </div>
            <div v-if="isDelaying" class="circle">
                <div class="circle-fill"></div>
            </div>
        </div>
        <div v-if="showInfo">
            <PointInfo :point="currentPoint" />
        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import state from '@/store';
import points from '@/assets/json/points.json'; // Импорт JSON файла
import PointInfo from '@/components/PointInfo.vue'; // Импорт компонента PointInfo


const currentPointIndex = ref(0);
const currentPoint = computed(() => points[currentPointIndex.value]);
const isDelaying = ref(false);
const showInfo = ref(false);
const delayTimeout = ref(null);

watch(
    () => state.currentValue,
    (newValue, oldValue) => {
        const difference = newValue - oldValue;
        if (difference > 10) {
            currentPointIndex.value = (currentPointIndex.value + 1) % points.length;
        } else if (difference < -10) {
            currentPointIndex.value = (currentPointIndex.value - 1 + points.length) % points.length;
        }
        startDelay();
    }
);

const startDelay = () => {
    clearTimeout(delayTimeout.value);
    isDelaying.value = true;
    delayTimeout.value = setTimeout(() => {
        isDelaying.value = false;
        showInfo.value = true;
        console.log('showInfo', showInfo);
    }, 2000); // 2 секунды задержки
};

const pointStyle = computed(() => {
    if (!currentPoint.value) return {};
    return {
        position: 'absolute',
        left: `${currentPoint.value.x}px`,
        top: `${currentPoint.value.y}px`,
        transform: 'translate(-50%, 30%)',
        color: 'white',
        backgroundColor: 'black',
        padding: '5px',
        borderRadius: '0%',
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
    opacity: 1;
}

.tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: .5vw;
    /* border-radius: 3px; */
    font-size: 1vw;
    text-align: center;
}

.circle {
    position: relative;
    width: 40px;
    height: 40px;
    border: 2px solid white;
    border-radius: 50%;
    overflow: hidden;
}

.circle-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: green;
    clip: rect(0px, 40px, 40px, 20px);
    transform: rotate(0deg);
    transform-origin: center center;
    animation: fillCircle 2s linear forwards;
}

@keyframes fillCircle {
    0% {
        transform: rotate(0deg);
    }

    50% {
        clip: rect(auto, auto, auto, auto);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>