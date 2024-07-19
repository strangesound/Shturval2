<template>
    <div class="container-extragame">
        <!-- <div class="stage stage0" :style="{ opacity: !stage ? 1 : 0 }">
            <p>Резкий поворот<br>направо через</p>
            <p>{{ formattedTime }}</p>
        </div> -->
        <div class="stage stage1">
            <!-- Штурвал -->
            <img src="/images/extra-game/steer-white.webp" alt="" class="rumba absolute5050" :style="rumbaStyle">

            <!-- Стрелки -->
            <img :style="{ opacity: stopGame ? 0 : 1 }" src="/images/extra-game/arrows-white.webp" alt=""
                class="absolute5050 white-steer-arrows">

            <p class="absolute5050 time-text" :style="{ opacity: stopGame ? 0 : 1 }">{{ formattedTime }}</p>

            <div class="absolute5050 pulse" :style="{ opacity: !stopGame ? 0 : 1 }">
                <p class="scores-number"> {{ result }} </p>
                <p class="scores" :style="{ opacity: !stopGame ? 0 : 1 }"> {{ getDeclension(result) }}</p>
            </div>
            <!-- Заполняющийся элемент бублик -->
            <svg class="svg-donut" viewBox="0 0 1032 1032">
                <defs>
                    <filter id="outer-glow-1" filterUnits="userSpaceOnUse">
                        <feOffset dx="0" dy="0" />
                        <feGaussianBlur result="blur" stdDeviation="30" />
                        <feFlood flood-color="#fff" flood-opacity=".75" />
                        <feComposite in2="blur" operator="in" />
                        <feComposite in="SourceGraphic" />
                    </filter>

                </defs>
                    <g>
                        <circle ref="donut" class="cls-3" cx="516" cy="516" r="376" 
                        :stroke-dasharray="strokeDasharray"
                        :stroke-dashoffset="strokeDashoffset" />
                    </g>
            </svg>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import shturval from '@/store';

const props = defineProps({
    extraGameDirection: Number
});
console.log(props.extraGameDirection);





const time = ref(3.00);
const adjustedValue = ref(0);
const maxAdjustedValue = ref(0); // Переменная для хранения максимального значения
const gameDuration = 3000; // Длительность игры в миллисекундах

const stopGame = ref(false)
const result = ref(0)
let intervalId;


const emit = defineEmits(['result']);
const sendResult = () => { emit('result', result.value); };



const formattedTime = computed(() => {
    let timeString = time.value.toFixed(2).replace('.', ',');
    if (time.value < 0.01) {
        timeString = '0,00';
    }
    return timeString;
});

const rumbaStyle = computed(() => {
    return {
        transform: `rotate(${adjustedValue.value}deg)`
    };
});

const updateTimer = () => {
    if (time.value > 0) {
        time.value -= 0.1;
    } else {
        clearInterval(intervalId);
        stopGame.value = true;
        result.value = Math.round(10 / 360 * maxAdjustedValue.value)
        sendResult()
        console.log(result);

    }
};

function getDeclension(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "баллов";
    }
    if (lastDigit === 1) {
        return "балл";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return "балла";
    }
    return "баллов";
}



let strokeDasharray = (2 * Math.PI * 376).toFixed(2); // Длина окружности = 2πr, где r = 500
const strokeDashoffset = ref(strokeDasharray);
const initialShturvalValue = ref(null);

const updateProgress = (value) => {
    const circleLength = parseFloat(strokeDasharray);
    let offsetValue;

    if (props.extraGameDirection === 1) {
        // Рост по часовой стрелке
        offsetValue = ((1 - value / 360) * circleLength).toFixed(2);

    } else {
        offsetValue = ((value / 360) * circleLength * -1).toFixed(2);
        // console.log('offsetValue', offsetValue);
        if (parseFloat(offsetValue) === 0) {
            return;
        }
    }
    strokeDashoffset.value = offsetValue;

    // console.log('value', value);
    // console.log('strokeDashoffset.value', strokeDashoffset.value);



};


watch(() => shturval.currentValue, (newValue) => {
    if (initialShturvalValue.value === null) {
        initialShturvalValue.value = newValue; // Устанавливаем начальное значение
        console.log('initialShturvalValue', initialShturvalValue.value);
    }

    if (stopGame.value || Math.abs(newValue - initialShturvalValue.value) > 359) {
        return;
    }

    if (props.extraGameDirection === 1) {
        if (newValue < initialShturvalValue.value) {
            return
        }
    }
    else {
        if (newValue > initialShturvalValue.value) {
            return
        }
    }

    let internalAdjustedValue = newValue - initialShturvalValue.value;

    internalAdjustedValue = ((internalAdjustedValue % 360) + 360) % 360;
    if (internalAdjustedValue > maxAdjustedValue.value) {
        maxAdjustedValue.value = internalAdjustedValue;
        // console.log('maxAdjustedValue.value', maxAdjustedValue.value);
    }
    updateProgress(internalAdjustedValue);
    adjustedValue.value = internalAdjustedValue

});

onMounted(() => {
    intervalId = setInterval(updateTimer, 100);
});

onUnmounted(() => {
    clearInterval(intervalId);
});


</script>

<style scoped>
.time-text {
    font-size: 204px;
}

.scores-number {
    font-size: 300px;
}

.scores {
    font-size: 90px;
}

.container-extragame {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99;
    /* background-color: transparent; */
}

.svg-donut {
    width: 1040px;
}

.absolute5050 {
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    transition: opacity .3s;
    /* left: 50%;
    top: 50%; */
    /* transform: translateX(-50%) translateY(-50%); */
}

.stage {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

}

p {
    font-size: 110px;
    font-weight: bold;
}

.white-steer-arrows {
    position: absolute;
    animation: sway .5s ease-in-out infinite;
    /* animation-delay: 2s; */
    opacity: 1;
    transition: opacity 1s;

}

@keyframes sway {
    0% {
        transform: rotate(-10deg);
    }

    50% {
        transform: rotate(10deg);
    }

    100% {
        transform: rotate(-10deg);
    }


}

.pulse {
    animation: pulse 0.5s infinite ease-in-out;
    /* Применение анимации */


}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
        /* Увеличение до 120% */
    }
}




.cls-3 {
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 100px;
    fill: none;
    filter: url(#outer-glow-1);

}
</style>