<template>
    <div>
        <img src="/images/main/rumba.png" alt="" class="rumba" :style="rumbaStyle">
        <img :src="arrowSrc" class="arrow" :class="{ 'show': showArrow, 'hide': !showArrow }">
        <!-- <button @click="showArrow = !showArrow" class="showMe">Click!</button> -->

    </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue';

const props = defineProps({
    point: Object
});

const showArrow = ref(false);



const centerX = 800; // Центр румбы по оси X
const centerY = 1370; // Центр румбы по оси Y


const rumbaStyle = computed(() => {
    //   if (!props.currentPoint) return {};

    const targetX = props.point.x;
    const targetY = props.point.y;
    const deltaX = targetX - centerX;
    const deltaY = targetY - centerY;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    // console.log('angleInDegrees', angleInDegrees);

    return {
        transform: `rotate(${(angleInDegrees + 90) % 360}deg)`
    };

});


const arrowSrc = ref(`/images/arrows/${props.point.image.toLowerCase()}_arrow.png`);

watch(() => props.point, (newPoint, oldPoint) => {
    if (oldPoint) {
        showArrow.value = false;
        setTimeout(() => {
            arrowSrc.value = `/images/arrows/${newPoint.image.toLowerCase()}_arrow.png`;
            setTimeout(() => {
                showArrow.value = true;
            }, 300); // Время для исчезновения старой стрелки
        }, 300); // Время для исчезновения старой стрелки
    } else {
        arrowSrc.value = `/images/arrows/${newPoint.image.toLowerCase()}_arrow.png`;
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

    transition: transform 3s ease;
    /* Плавный переход для поворота */
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
    transition: opacity 0.3s ease-in-out, clip-path 0.3s ease-in-out;
    /* background-color: #007bff6b; */
}

.arrow.show {
    opacity: 1;
    animation: expandClipPath 5s forwards;
    /* Анимация для расширения clip-path */
}

.arrow.hide {
    opacity: 0;
    clip-path: circle(0% at 800px 1370px);
    /* Центр румбы */
}

@keyframes expandClipPath {
    0% {
        clip-path: circle(7% at 800px 1370px);
    }

    100% {
        clip-path: circle(100% at 800px 1370px);
    }
}

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