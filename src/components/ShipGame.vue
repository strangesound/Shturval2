<script setup>
import { ref, watch, computed } from 'vue';

import state from '@/store';

const heading = ref(0); // Направление в градусах
const speed = ref(60);  // Скорость кадров в секунду
const maxDeviation = 15; // Максимальное отклонение фона в процентах

// Вычисляемое смещение фонового видео
const backgroundPosition = computed(() => {
    const deviation = heading.value % 30;
    const percent = (deviation / 30) * maxDeviation * 2 - maxDeviation;
    return percent.toFixed(2); // Округляем до двух десятичных знаков
});




let lastEncoderValue = 0;  // Переменная для хранения последнего значения энкодера

function updateHeading(currentEncoderValue) {
    // Вычисление изменения значения от энкодера
    const encoderDelta = currentEncoderValue - lastEncoderValue;
    const normalizedEncoderDelta = Math.max(-30, Math.min(30, encoderDelta)); // Ограничение изменения от -30 до +30

    // Получение случайного воздействия ветра от -5 до +5
    const windStrength = Math.random() * 10 - 5;

    // Расчет нового направления с учётом ветра
    const newHeading = heading.value + normalizedEncoderDelta + windStrength;

    // Ограничение нового направления в пределах от -30 до +30
    heading.value = Math.max(-30, Math.min(30, newHeading));

    // Обновление последнего значения энкодера
    lastEncoderValue = currentEncoderValue;

    // Вызов функции обновления скорости или других связанных обновлений
    adjustSpeed();
}

// Запуск функции обновления каждые 100 мс
setInterval(() => {
    updateHeading(state.currentValue);
}, 100);


function adjustSpeed() {
    const absHeading = Math.round(Math.abs(heading.value));
    speed.value = 60 - absHeading * 1.2;
}







</script>

<template>
    <div class="container">
        <div class="videoposition" :style="`transform: translateX(${heading/5 * -1}vw);`">
            <video loop autoplay playsinline src="/video/zamok_lastochkino_gnezdo.mp4"></video>
        </div>

        <div class="gradient"></div>

        <div class="course-container">

            <div class="course"></div>
            <div class="course-arrow" :style="{ rotate: `${heading}deg` }"></div>
            <div class="course-text-container">
                <div class="left-col">
                    <p class="smalltext">Осталось</p>
                    <p class="largetext">{{ heading.toFixed() }}</p>
                </div>
                <div class="right-col">
                    <p class="smalltext">Скорость</p>
                    <p class="largetext">{{ speed.toFixed() }}</p>
                </div>
            </div>



        </div>


    </div>
</template>



<style scoped>
.container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    z-index: 9999999;
    overflow: hidden;
}

h1,
p {
    font-size: 3vw;
}

.videoposition {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: show;
    z-index: -1;
    transition: transform 1s;

}

video {
    position: relative;
    width: 150vw;
    height: 100vh;
    object-fit: fill;
    left: -25vw;
    /* object-position: 50% 50%; */
}

.course-container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.course {
    margin-top: 5vw;
    position: absolute;
    background-image: url('/images/landmarks/ui/kursmain.png');
    background-repeat: no-repeat;
    z-index: 5;
    width: 1740px;
    height: 551px;

}

.course-arrow {
    position: absolute;
    margin-top: 7.5vw;
    background-image: url('/images/landmarks/ui/redArrow.png');
    background-repeat: no-repeat;
    z-index: 5;
    width: 3480px;
    height: 3480px;
    rotate: 0deg;
    transition: rotate 2s;

}

.course-text-container {
    position: relative;
    display: flex;
    gap: 5vw;
    margin-top: 14.3vw;
}

.smalltext {
    font-size: 38px;
    font-weight: 300;
}

.largetext {
    font-size: 110px;
    font-weight: 700;
}


.gradient {
    position: absolute;
    background: linear-gradient(#000000, #00000000);
    width: 100vw;
    height: 50vh;
}
</style>