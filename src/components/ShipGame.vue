<script setup>
import { ref, computed, watch } from 'vue';
import shturval from '@/store';
import PointInfo from '@/components/PointInfo.vue';
import points from '@/assets/json/points.json'; // Импорт JSON файла
import { states, currentState, setState } from '@/states'; // Импортируем константы и функцию

const props = defineProps({
    point: Object
});

// console.log(props.point);

const heading = ref(0); // Направление в градусах
const speed = ref(60);  // Скорость кадров в секунду
const maxDeviation = 15; // Максимальное отклонение фона в процентах
const videoBackground = ref(null);
const videoShip = ref(null);
const playbackRate = ref(1)
const meters = ref(5000)
let updateInterval = null;
const showInfo = ref(false);
const score = ref(0);
const gameStopped = ref(false);

const deviations = {
    count: 0,
    totalDeviation: 0
};



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

    // Обновление объекта отклонений
    deviations.count += 1;
    deviations.totalDeviation += Math.abs(heading.value);

    // Вызов функции обновления скорости или других связанных обновлений
    adjustSpeed();

}

// Запуск функции обновления каждые 100 мс
updateInterval = setInterval(() => {
    updateHeading(shturval.currentValue);
}, 100);


function adjustSpeed() {
    const maxDeviation = 30;
    const maxRate = 1.5;
    const minRate = 0.5;

    // Абсолютное значение heading для расчета отклонения
    const absHeading = Math.abs(heading.value);

    // Линейная интерполяция для вычисления playbackRate
    // Когда absHeading = 0, playbackRate = maxRate (1.5)
    // Когда absHeading = maxDeviation (30), playbackRate = minRate (0.5)
    playbackRate.value = maxRate - (absHeading / maxDeviation) * (maxRate - minRate);

    // Устанавливаем вычисленное значение playbackRate для видео
    if (videoBackground.value && videoShip.value) {
        videoBackground.value.playbackRate = playbackRate.value;
        videoShip.value.playbackRate = playbackRate.value;
        meters.value = -Math.round((videoBackground.value.currentTime) * 166 - 5000)
    }


}



function calculateScore() {
    if (deviations.count === 0) return 100; // Если нет отклонений, присваиваем максимальный балл

    const averageDeviation = deviations.totalDeviation / deviations.count;

    // Подсчет баллов на основе среднего отклонения
    const score = 100 - (averageDeviation / 30) * (100 - 40); // 100 баллов за 0 отклонений, 40 баллов за среднее отклонение 30

    return Math.round(Math.max(40, score)); // Гарантируем, что минимальный балл не меньше 40
}

function stopGame() {
    clearInterval(updateInterval);
    score.value = calculateScore();
    console.log(`Игра окончена! Ваши баллы: ${score.value}`);
    showInfo.value = true;

    setTimeout(() => {
        gameStopped.value = true;
    }, 300);
}


// Наблюдатель за gameStopped
watch(gameStopped, (newValue) => {
    if (newValue === true) {
        const stopWatch = watch(() => shturval.currentValue, (newValue, oldValue) => {
            console.log(newValue);
            const difference = newValue - oldValue;

            if (Math.abs(difference) > 50) {
                setState(states.MAP);
                stopWatch(); // Остановить наблюдателя после изменения состояния
            }
        });
    }
});


function getDeclension(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return "узлов";
    }
    if (lastDigit === 1) {
        return "узел";
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return "узла";
    }
    return "узлов";
}

const progressRedRotation = ref(-75); // начальное положение


const redStyle = computed(() => ({
    transform: `rotate(${progressRedRotation.value}deg)`,
    transformOrigin: 'center center', // убедитесь, что центр вращения установлен правильно
    transition: 'transform 0.5s ease-out' // плавное изменение положения
}));

// Функция для обновления прогресса
function updateProgress() {
    if (!videoBackground.value) return;

    const duration = 30; // предполагаем, что продолжительность видео 30 секунд
    const current = videoBackground.value.currentTime;
    const progress = current / duration;

    const startDegree = -75; // начальная градусная метка
    const endDegree = -15.6; // конечная градусная метка
    const degreeRange = endDegree - startDegree;

    progressRedRotation.value = startDegree + (degreeRange * progress);
}


</script>

<template>
    <div class="container">
        <button class="tech" @click="stopGame">{{ shturval.currentValue }}</button>

        <div class="videoposition" :style="`transform: translateX(${heading / 5 * -1}vw);`">
            <video ref="videoBackground" @timeupdate="updateProgress" class="videobackground" muted autoplay playsinline
                src="/video/zamok_lastochkino_gnezdo.mp4" @ended="stopGame"></video>
            <!-- @ended="stopGame" -->
        </div>
        <div class="ship-position" :style="`transform: translateX(${heading / 20 * 1}vw);`">
            <video ref="videoShip" class="ship" muted loop autoplay playsinline src="/video/shipAlpha.webm"></video>
        </div>

        <div class="gradient"></div>

        <div class="course-container" :style="{ opacity: showInfo ? 0 : 1 }">

            <div class="course"></div>
            <div class="course-arrow" :style="{ rotate: `${heading}deg` }"></div>
            <div class="course-text-container">
                <!-- <div class="left-col">
                    <p class="smalltext">Осталось</p>
                    <p class="largetext">{{ meters }} м</p>
                </div> -->
                <div class="right-col">
                    <p class="smalltext">Скорость</p>
                    <p class="largetext">{{ (playbackRate * 20).toFixed() }} {{ getDeclension((playbackRate *
            20).toFixed()) }}</p>
                </div>
            </div>

            <div class="progress-container">

                <img src="/images/progressGray.webp" alt="" class="progressGray">
                <img src="/images/progressRed.webp" alt="" class="progressRed" :style="redStyle">

            </div>


            <div class="landmark-name">{{ props.point.landmark }}</div>
        </div>


        <Transition>
            <PointInfo v-if="showInfo" :point="props.point" :score="score" />
        </Transition>



    </div>
</template>



<style scoped>
.progress-container {
    position: absolute;
    top: 450px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999999;
    width: 3150px;
    height: 3150px;
    /* background: rgba(255, 0, 0, 0.126); */
    clip-path: polygon(21.13% 0, 78.87% 0, 21.13% 100%, 78.87% 100%);


}

.progressGray,
.progressRed {
    position: absolute;
    top: 0;
    left: 0;
}

.progressRed {
    transform: rotate(-15.7deg);
    transition: transform .3s;
}



.container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    z-index: 10;
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

.videobackground {
    position: relative;
    width: 200vw;
    height: 100vh;
    object-fit: fill;
    left: -50vw;
    /* object-position: 50% 50%; */
}

.ship-position {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    overflow: show;
    z-index: -1;
    transition: transform 1s;

}

.ship {
    position: relative;
    width: 200vw;
    height: 100vh;
    object-fit: fill;
    left: -50vw;
    /* object-position: 50% 50%; */
}

.course-container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 1;
    transform: opacity 1s;
}

.course {
    margin-top: 5vw;
    position: absolute;
    background-image: url('/images/landmarks/ui/kursmain.webp');
    background-repeat: no-repeat;
    z-index: 5;
    width: 1740px;
    height: 551px;

}

.course-arrow {
    position: absolute;
    margin-top: 7.5vw;
    background-image: url('/images/landmarks/ui/redArrow.webp');
    background-repeat: no-repeat;
    z-index: 5;
    width: 3480px;
    height: 3480px;
    rotate: 0deg;
    transition: rotate 1s;

}

.course-text-container {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    /* gap: 0vw; */
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

.right-col {
    margin-left: 2vw;
}

.gradient {
    position: absolute;
    background: linear-gradient(#000000, #00000000);
    width: 100vw;
    height: 50vh;
}


.tech {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999999999;
    font-size: 1vw;
}

.landmark-name {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 5vw;
    left: 50%;
    transform: translate(-50%);
    background-image: url('/images/landmarks/ui/bigbtn.webp');
    background-repeat: no-repeat;
    color: var(--black);
    font-size: 50px;
    width: 1534px;
    height: 148px;
    transition: rotate 2s;
    z-index: 99999;
}
</style>