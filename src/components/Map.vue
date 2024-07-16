<template>
    <div class="map-container">
        <!-- <img src="/images/sea.jpg" alt="" class="mapBackVideo"> -->
        <video ref="mapBackVideo" class="mapBackVideo" muted loop autoplay playsinline
            src="/video/screenSaver-loop.mp4"></video>
        <video ref="mapVideo" src="/video_small_size/mainMapUnfold.webm" playsinline autoplay class="map"></video>

        <div ref="mapAdditionalInfo" class="container-timeout">
            <!-- <div :style="pointStyle" class="point">
                <div v-if="props.point" class="tooltip">{{ landmark }}</div>
            </div> -->
            <p :style="pointStyle" class="tooltip2">{{ props?.point?.landmark }}</p>
            <img src="/images/point.svg" class="point-dot" :style="pointPosition" alt="">

            <Rumba :point="props.point" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch, toRef, nextTick } from 'vue';
// import points from '@/assets/json/points.json';
import Rumba from '@/components/Rumba.vue';

const mapAdditionalInfo = ref(null)
const opacityValue = ref(0);

const props = defineProps({
    point: Object,
    showGame: Boolean

});

const showGameRef = toRef(props, 'showGame');

const mapVideo = ref(null);
const mapBackVideo = ref(null);

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
            left: '0px',
            top: '0px'
        };
    }
    return {
        opacity: '1',
        position: 'absolute',
        left: `${props.point.x}px`, // Использование calc()
        top: `${props.point.y}px`,
        textAlign: 'center'
    };
});


setTimeout(() => {
    mapAdditionalInfo.value.style.opacity = 1
}, 2000);


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


.mapBackVideo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
}
</style>