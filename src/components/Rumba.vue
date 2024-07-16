<template>
    <div>
        <img src="/images/main/steer.webp" alt="" class="rumba" :style="rumbaStyle">
        <img src="/images/shipDots.webp" alt="" class="rumbaShip">
        <img :src="arrowSrc" class="arrow" :class="{ 'show': showArrow, 'hide': !showArrow }">
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import shturval from '@/store';
// console.log('shturval', shturval);
// console.log('shturval.value', shturval.currentValue);


const props = defineProps({
    point: Object
});


const showArrow = ref(false);

const arrowImage = ref(null)

const rumbaStyle = computed(() => {
    return {
        // transform: `rotate(${(angleInDegrees + 90) % 360}deg)`
        // transform: `rotate(${props.point.angle}deg)`
        transform: `rotate(${shturval.currentValue-72}deg)`
        // };
    };
});


function setArrowAnimation() {
    // console.log('clipPath', clipPath);
    const keyframes = `
    @keyframes expandClipPath {
      0% {
        clip-path: circle(7% at 800px 1370px);
      }
      100% {
        clip-path: circle(${props.point?.animationClipPath || '75'}% at 800px 1370px);
      }
    }
  `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
}

const routeBellArrowStart = new Audio('/sounds/route-bell-arrow-start.wav');
// const routeBellArrowEnd = new Audio('/sounds/route-bell-arrow-end.wav');

const playSound = () => {
    routeBellArrowStart.currentTime = 0; // Сбросить время воспроизведения
    routeBellArrowStart.volume = 0.5;
    routeBellArrowStart.play();
};

const arrowSrc = ref('');


watch(() => props.point, (newPoint, oldPoint) => {
    console.log('props rumba', props.point);
    console.log('props rumba', props.point?.image);
    if (props.point?.image) {
        playSound()
    }
    setArrowAnimation();
    if (oldPoint) {
        showArrow.value = false;
        setTimeout(() => {
            arrowSrc.value = `/images/arrows/${props.point?.image.toLowerCase()}.webp`;
            setTimeout(() => {
                showArrow.value = true;
            }, 300); // Время для исчезновения старой стрелки
        }, 300); // Время для исчезновения старой стрелки
    } else {
        arrowSrc.value = `/images/arrows/${props.point?.image.toLowerCase()}.webp`;
        showArrow.value = true;
    }
});



</script>

<style scoped>
.showMe {
    position: absolute;
    left: 10%;
    top: 10%;
    z-index: 500;
    font-size: 5vw;
}

.rumba {
    position: absolute;
    left: 524px;
    top: 1061px;

    width: 586px;
    height: 614px;
    transform-origin: 'center center';

    /* transition: transform .1s ease-in; */
}

.rumbaShip {
    position: absolute;
    left: 817px;
    top: 1368px;
    
    width: 586px;
    height: 614px;
    transform: translateX(-50%) translateY(-50%);
}

.arrow {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    clip-path: circle(0% at 800px 1370px);
    /* Центр румбы */
    transition: opacity 0.3s ease-in, clip-path 0.3s ease-in;
    /* background-color: #007bff6b; */
}

.arrow.show {
    opacity: 1;
    animation: expandClipPath 3s forwards;
    /* background-color: #007bff46; */
    /* Анимация для расширения clip-path */
}

.arrow.hide {
    opacity: 0;
    clip-path: circle(0% at 800px 1370px);
    /* Центр румбы */
}

/* @keyframes expandClipPath {
    0% {
        clip-path: circle(7% at 800px 1370px);
    }

    100% {
        clip-path: circle(16% at 800px 1370px);
    }
} */

.showMe {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>