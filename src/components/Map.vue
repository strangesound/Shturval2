<template>
    <div class="map-container">
        <!-- <img src="/images/sea.jpg" alt="" class="mapBackVideo"> -->
        <video ref="mapBackVideo" class="mapBackVideo" muted loop autoplay playsinline
            src="/video/screenSaver.mp4"></video>
        <video ref="mapVideo" src="/video_small_size/mainMapUnfold.webm" muted playsinline autoplay class="map"></video>

        <div ref="mapAdditionalInfo" class="container-timeout">
            <div :style="pointStyle" class="point">
                <div class="tooltip">{{ props.point.landmark }}</div>
            </div>
            <Rumba :point="props.point" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch, toRef, nextTick } from 'vue';
// import points from '@/assets/json/points.json';
import Rumba from '@/components/Rumba.vue';

const mapAdditionalInfo = ref(null)

const props = defineProps({
    point: Object,
    showGame: Boolean

});

const showGameRef = toRef(props, 'showGame');


console.log('showGame', props.showGame);

const mapVideo = ref(null);
const mapBackVideo = ref(null);

const pointStyle = computed(() => {
    if (!props.point) return {};
    return {
        position: 'absolute',
        left: `${props.point.x}px`,
        top: `${props.point.y}px`,
        transform: 'translate(-50%, -130%)',
        textAlign: 'center',
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
    font-size: 1.042vw;
    line-height: 1;
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