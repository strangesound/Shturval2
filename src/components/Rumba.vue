<template>
    <div>
        <img src="/images/main/rumba.webp" alt="" class="rumba" :style="rumbaStyle">
        <img src="/images/rumbaShip.png" alt="" class="rumbaShip">
        <img :src="arrowSrc" class="arrow" :class="{ 'show': showArrow, 'hide': !showArrow }">
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    point: Object
});


const showArrow = ref(false);



// const centerX = 800; // Центр румбы по оси X
// const centerY = 1370; // Центр румбы по оси Y


const rumbaStyle = computed(() => {
    // const targetX = props.point.x;
    // const targetY = props.point.y;
    // const deltaX = targetX - centerX;
    // const deltaY = targetY - centerY;
    // const angleInRadians = Math.atan2(deltaY, deltaX);
    // const angleInDegrees = angleInRadians * (180 / Math.PI);
    // console.log('angleInDegrees', angleInDegrees);
    return {
        // transform: `rotate(${(angleInDegrees + 90) % 360}deg)`
        transform: `rotate(${props.point.angle}deg)`
    };
});


function setArrowAnimation() {
    console.log('props.point.animationClipPath', props.point.animationClipPath);
    const keyframes = `
    @keyframes expandClipPath {
      0% {
        clip-path: circle(7% at 800px 1370px);
      }
      100% {
        clip-path: circle(${props.point.animationClipPath || '75'}% at 800px 1370px);
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

const arrowSrc = ref(`/images/arrows/${props.point.image.toLowerCase()}.svg`);


watch(() => props.point, (newPoint, oldPoint) => {



    playSound()

    setArrowAnimation();
    if (oldPoint) {
        showArrow.value = false;
        setTimeout(() => {
            arrowSrc.value = `/images/arrows/${newPoint.image.toLowerCase()}.svg`;
            setTimeout(() => {
                showArrow.value = true;
            }, 300); // Время для исчезновения старой стрелки
        }, 300); // Время для исчезновения старой стрелки
    } else {
        arrowSrc.value = `/images/arrows/${newPoint.image.toLowerCase()}.svg`;
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
    left: 527px;
    top: 1102px;

    transition: transform 1s ease-in;
}

.rumbaShip {
    position: absolute;
    left: 699px;
    top: 1281px;
    /* left: 800px;
    top: 1370px;
    transform: translate(-50%, -50%); */
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