<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import shturval from '@/store';
import PointInfo from '@/components/PointInfo.vue';
import ExtraGame from '@/components/ExtraGame.vue';
import { states, setState, } from '@/states'; // Импортируем константы и функцию

const emit = defineEmits(['unmounted']);

onUnmounted(() => {
    emit('unmounted');
});



const props = defineProps({
    point: Object
});


const heading = ref(0); // Направление в градусах
const videoBackground = ref(null);
const videoShip = ref(null);
const playbackRate = ref(1)
const meters = ref(5000)
let updateInterval = null;
const showInfo = ref(false);
const score = ref(0);
const extraGameScore = ref(0)
const gameStopped = ref(false);
const hideWarning = ref(false);
const extraGameDirection = ref(null)



const handleResultUpdate = (newResult) => { extraGameScore.value = newResult; };

const deviations = {
    count: 0,
    totalDeviation: 0
};

let seaSound;
let endRouteSound;
let bell01Sound;
let bell02Sound;
let warningAndGame;






onMounted(() => {
    seaSound = new Audio('/sounds/sea.wav');
    seaSound.currentTime = 0; // Сбросить время воспроизведения
    seaSound.play();

    extraGameDirection.value = Math.random() > 0.5 ? 1 : 0


});

onUnmounted(() => {
    if (seaSound) {
        seaSound.pause();
        seaSound = null;
    }
    if (endRouteSound) {
        endRouteSound.pause();
        endRouteSound = null;
    }

    if (bell01Sound) {
        bell01Sound.pause();
        bell01Sound = null;
    }
    if (bell02Sound) {
        bell02Sound.pause();
        bell02Sound = null;
    }
    if (warningAndGame) {
        warningAndGame.pause();
        warningAndGame = null;
    }
});

let lastEncoderValue = 0;  // Переменная для хранения последнего значения энкодера

function updateHeading(currentEncoderValue) {
    // Вычисление изменения значения от энкодера
    const encoderDelta = currentEncoderValue - lastEncoderValue;
    const normalizedEncoderDelta = Math.max(-30, Math.min(30, encoderDelta)); // Ограничение изменения от -30 до +30

    // Получение случайного воздействия ветра от -5 до +5
    const windStrength = Math.random() * 20 - 10;

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
}, 200);

setTimeout(() => {
    hideWarning.value = true;
}, 5000); // Через 5 секунд установить флаг прозрачности



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
    console.log('score', score);
    let finalScore = score + extraGameScore.value;
    console.log('finalScore', finalScore);

    return Math.round(Math.max(40, Math.min(100, finalScore)));
}

function stopGame() {

    clearInterval(updateInterval);

    endRouteSound = new Audio('/sounds/route-bell-end.wav');
    endRouteSound.play();

    score.value = calculateScore();
    // console.log(`Игра окончена! Ваши баллы: ${score.value}`);
    showInfo.value = true;

    setTimeout(() => {
        gameStopped.value = true;
        console.log('gameStopped.value', gameStopped.value);
    }, 6000);
}


// Наблюдатель за gameStopped
watch(gameStopped, (newValue) => {
    if (newValue === true) {
        const stopWatch = watch(() => shturval.currentValue, (newValue, oldValue) => {
            console.log(newValue);
            const difference = newValue - oldValue;

            if (Math.abs(difference) > 5) {
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

const progressRedRotation = ref(-90); // начальное положение


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

    const startDegree = -60; // начальная градусная метка
    const endDegree = 0; // конечная градусная метка
    const degreeRange = endDegree - startDegree;

    progressRedRotation.value = startDegree + (degreeRange * progress);
}

const opacityValue = ref(0);
onMounted(() => {

    setTimeout(() => {
        opacityValue.value = 1;
    }, 1000);
});

const extraGameShow = ref(false)
const blurValue = ref(0);
const stdDeviation = computed(() => `${blurValue.value} ${blurValue.value / 10}`);
const showRotationWarning = ref(false);
const showSwimFurtherWarning = ref(false);
const intervalId = ref(null);
const time = ref(5.00);


function startExtraGame() {
    if (videoBackground.value) {
        videoBackground.value.pause();
    }
    extraGameShow.value = true;
    clearInterval(updateInterval);

    // console.log('extraGameShowStart', extraGameShow);

    animateBlurValue(200, 1000);
}

function endExtraGame() {
    extraGameShow.value = false;

    updateInterval = setInterval(() => {
        updateHeading(shturval.currentValue);
    }, 200);
    console.log('Extra game ended and interval resumed');


    // console.log('extraGameShowEnd', extraGameShow);
    animateBlurValue(0, 1000);
    if (videoBackground.value) {
        videoBackground.value.play();
    }
}

function animateBlurValue(targetValue, duration) {
    const startValue = blurValue.value;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        blurValue.value = startValue + (targetValue - startValue) * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const showRotationWarningTime = computed(() => {
    let timeString = time.value.toFixed(2).replace('.', ',');
    if (time.value < 0.01) {
        timeString = '0,00';
    }
    return timeString;
});

const updateTimer = () => {
    if (time.value > 0) {
        time.value -= 0.1;
    }
};

async function executeSequence() {
    await sleep(10000);

    showRotationWarning.value = true;
    console.log('showRotationWarning', showRotationWarning.value);

    intervalId.value = setInterval(updateTimer, 100);


    warningAndGame = new Audio('/sounds/extraGame/warningAndGame.wav');
    warningAndGame.currentTime = 0; // Сбросить время воспроизведения
    warningAndGame.play();

    //     let bell01Sound;
    // let bell02Sound;
    // let warningAndGame;

    await sleep(5000);
    showRotationWarning.value = false;
    console.log('showRotationWarning', showRotationWarning.value);

    // Запуск игры
    clearInterval(intervalId.value);
    startExtraGame();

    // bell01Sound = new Audio('/sounds/extraGame/bell01Sound.wav');
    // bell01Sound.currentTime = 0; // Сбросить время воспроизведения
    // bell01Sound.play();


    await sleep(6000);

    endExtraGame();
    await sleep(1000);

    showSwimFurtherWarning.value = true
    bell02Sound = new Audio('/sounds/extraGame/bell02Sound.wav');
    bell02Sound.currentTime = 0; // Сбросить время воспроизведения
    bell02Sound.play();

    await sleep(3000);


    showSwimFurtherWarning.value = false


}



onMounted(() => {
    executeSequence()
});



</script>

<template>
    <div class="container">
        <!-- <button class="tech" @click="stopGame">Остановить игру {{ shturval.currentValue }}</button> -->


        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="filter-svg">
            <defs>
                <filter id="horizontalBlur">
                    <feGaussianBlur in="SourceGraphic" :stdDeviation="stdDeviation" />
                </filter>
            </defs>
        </svg>

        <div class="videoposition" :style="`transform: translateX(${heading / 5 * -1}vw);`">
            <video ref="videoBackground" @timeupdate="updateProgress" class="videobackground" muted autoplay playsinline
                :src="`/video/${props?.point?.image}.mp4`" @ended="stopGame"></video>
            <!-- @ended="stopGame" -->
        </div>
        <div class="ship-position" :style="`transform: translateX(${heading / 20 * 1}vw);`">
            <video ref="videoShip" class="ship blur-active" muted loop autoplay playsinline
                :src="`/video/${props?.point?.image}.webm`"></video>
        </div>

        <div class="gradient"></div>

        <div class="course-container" :style="{ opacity: (showInfo || !hideWarning || extraGameShow) ? 0 : 1 }">
            <div class="course"></div>
            <div class="course-arrow" :style="{ rotate: `${heading}deg` }"></div>
            <div class="course-text-container">
                <p class="smalltext">Скорость</p>
                <p class="largetext">{{ (playbackRate * 6).toFixed() }} {{ getDeclension((playbackRate *
                    6).toFixed()) }}</p>
            </div>
            <div class="progress-container">
                <img src="/images/ui2/progressBar.svg" alt="" class="progressRed" :style="redStyle">
            </div>
            <div class="landmark-name">{{ props.point.landmark }}</div>
        </div>

        <div class="showRotationWarning" :style="{ opacity: showRotationWarning ? 1 : 0 }">
            <p class="" v-html="`Резкий поворот<br>${extraGameDirection ? 'направо' : 'налево'} через`"></p>
            <p class="">{{ showRotationWarningTime }} секунды</p>
        </div>
        <div class="showRotationWarning" :style="{ opacity: showSwimFurtherWarning ? 1 : 0 }">
            <p class="">Отлично,<br>плывем дальше!</p>
        </div>

        <div class="help" :style="{ opacity: hideWarning ? 0 : 1 }">
            <video ref="mapVideo" src="/video_small_size/pointUnfold.webm" playsinline muted autoplay
                class="svitok"></video>
            <p class="help-text" :style="{ opacity: opacityValue }">С помощью штурвала удерживайте курс
                прямо,<br>чтобы корабль двигался с максимальной скоростью!</p>
        </div>

        <Transition>
            <ExtraGame v-if="extraGameShow" @result="handleResultUpdate" :extraGameDirection="extraGameDirection" />
        </Transition>


        <Transition>
            <PointInfo v-if="showInfo" :point="props.point" :score="score" />
        </Transition>


    </div>
</template>



<style scoped>
.filter-svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100%;
    z-index: 99999999999;
    pointer-events: none;
}

.blur-active {
    filter: url(#horizontalBlur);
}



.showRotationWarning {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    font-size: 110px;
    line-height: 1.2;
    width: 100vw;
    height: 100%;
    background-color: #00000050;
    opacity: 0;
    transition: opacity 1s;
    z-index: 100000000;
}

.help {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    /* transform: translate(-50%); */
    font-size: 120px;
    line-height: 1.2;
    width: 100vw;
    height: 100%;
    background-color: #00000070;
    opacity: 1;
    transition: opacity 1s;
    z-index: 100000000;
}

.help-text {
    position: absolute;
    width: 40vw;
    font-size: 3vw;
    color: #301904;
    opacity: 0;
    transition: opacity 1s;
    /* mix-blend-mode: multiply; */
}

.help>video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 70vh;
    margin-top: 13vh;
    object-fit: fill;
}

.progress-container {
    clip-path: polygon(21.0% 0, 78.87% 0, 25% 100%, 78.87% 100%);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3812px;
    height: 3812px;
    z-index: 9;

}

.progressRed {
    position: absolute;
    width: 3812px;
    height: 3812px;
    transform: rotate(-60deg);
    transition: transform .3s;
    /* background-color: #8e1f1f43; */
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
    transition: filter 1s ease;
    filter: url(#horizontalBlur);


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
    transition: filter 1s ease;
    filter: url(#horizontalBlur);


    /* object-position: 50% 50%; */
}

.course-container {
    width: 3812px;
    height: 3812px;
    position: absolute;
    top: 0;
    left: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 1s;
}

.course {
    position: absolute;
    background-image: url('/images/ui2/mainBar.svg');
    background-repeat: no-repeat;
    z-index: 5;
    width: 3812px;
    height: 3812px;

}

.course-arrow {
    position: absolute;
    background-image: url('/images/ui2/redArrow.svg');
    background-repeat: no-repeat;
    z-index: 5;
    width: 3812px;
    height: 3812px;
    rotate: 0deg;
    transition: rotate 1s;

}

.course-text-container {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr;
    /* gap: 0vw; */
    /* margin-top: 14.3vw; */
    top: 12vw;
    transform: translateX(-50%);
    left: 50%;
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
    top: 85vh;
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