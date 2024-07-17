<template>
    <div class="map-container">
        <img src="/images/map-background.webp" alt="" class="mapBackVideo">
        <!-- <video ref="mapBackVideo" class="mapBackVideo" muted loop autoplay playsinline
            src="/video/screenSaver-loop.mp4"></video> -->
        <video ref="mapVideo" src="/video_small_size/mainMapUnfold.webm" playsinline muted autoplay class="map"></video>

        <div ref="mapAdditionalInfo" class="container-timeout">
            <!-- <div :style="pointStyle" class="point">
                <div v-if="props.point" class="tooltip">{{ landmark }}</div>
            </div> -->
            <p :style="pointStyle" class="tooltip2">{{ props?.point?.landmark }}</p>
            <div class="arrowsTooltip3" :style="{ opacity: tooltip3Opacity }">
                <p class="tooltip3" >поверните<br>штурвал и остановите<br>на три секунды для выбора достопримечательности</p>
                <img src="/images/steer-arrows.svg" alt="" class="steer-arrows">
            </div>
            <img src="/images/point.svg" class="point-dot" :style="pointPosition" alt="">

            <Rumba :point="props.point" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch, toRef, nextTick } from 'vue';
import Rumba from '@/components/Rumba.vue';
import shturval from '@/store';


const mapAdditionalInfo = ref(null)

const props = defineProps({
    point: Object,
    showGame: Boolean

});

const showGameRef = toRef(props, 'showGame');

const mapVideo = ref(null);
const mapBackVideo = ref(null);


const tooltip3Opacity = ref(1);

const resetTooltip3Opacity = () => {
    tooltip3Opacity.value = 1;
};

let tooltip3Timer;
watch(() => props.point, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        tooltip3Opacity.value = 0;
        clearTimeout(tooltip3Timer);
        tooltip3Timer = setTimeout(resetTooltip3Opacity, 10000);
    }
});



const pointStyle = computed(() => {
    if (!props.point) {
        return { opacity: '0' }
    }
    return {
        opacity: 1
    };
});



const pointPosition = computed(() => {
    if (!props.point) {
        return {
            opacity: '0',
            left: '-100px',
            top: '-100px'
        };
    }
    return {
        opacity: '1',
        position: 'absolute',
        left: `${props.point.x}px`,
        top: `${props.point.y}px`,
        textAlign: 'center'
    };
});


setTimeout(() => {
    mapAdditionalInfo.value.style.opacity = 1
}, 2500);


watch(showGameRef, (newValue) => {
    if (mapBackVideo.value) {
        if (newValue === true) {
            mapBackVideo.value.pause();
            console.log('video paused');
        } else {
            mapBackVideo.value.play();
            console.log('video play');
        }
    }
});



</script>



<style scoped>
.point-dot {
    width: 72px;
    height: 72px;
    opacity: 0;
    position: absolute;
    transition: opacity 1s;
    /* transition: opacity 1s, left 1s, top 1s; */

    animation: pulse 1.5s infinite ease-in-out;
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

.steer-arrows {
    width: 745px;
    position: absolute;
    left: 445px;
    top: 1273px;
    animation: sway 2s ease-in-out infinite;
    animation-delay: 2s;
    opacity: 1;
    transition: opacity 1s;

}

@keyframes sway {
    10% {
        transform: rotate(0deg);
    }

    16% {
        transform: rotate(10deg);
    }

    32% {
        transform: rotate(-10deg);
    }

    48% {
        transform: rotate(10deg);
    }

    64% {
        transform: rotate(-10deg);
    }

    90% {
        transform: rotate(0deg);
    }
}

.container-timeout {
    opacity: 0;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 3s;
}

.map-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    overflow: hidden;
    /* background-color: #64370e; */
}

.map {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;

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
    font-size: 3.042vw;
    line-height: 1;
}


.tooltip2 {
    position: absolute;
    left: 817px;
    top: 1368px;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-shrink: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 285px;
    height: 500px;
    color: #eedec6;
    text-align: center;
    font-size: 30px;
    line-height: 1;
    z-index: 2;
    white-space: pre-wrap;
    opacity: 0;
    transition: opacity .3s;
}

.tooltip3 {
    position: absolute;
    left: 817px;
    top: 1368px;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-shrink: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 350px;
    height: 500px;
    color: #eedec6;
    text-align: center;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 400;
    line-height: 1.2;
    z-index: 2;
    white-space: pre-wrap;
    opacity: 1;
    transition: opacity .3s;
}


.mapBackVideo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
}
</style>