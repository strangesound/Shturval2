<template>
  <div class="container">
    <video ref="video" class="background-video" :src="videoSrc" @ended="handleVideoEnd" autoplay muted playsinline></video>
    <div v-if="showInfo" class="point-info">
      <h1>{{ point.city }}: {{ point.landmark }}</h1>
      <p>{{ point.description }}</p>
      <img :src="`./images/${point.image.toLowerCase()}.jpg`" alt="Фото достопримечательности">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';

const props = defineProps({
  point: Object
});

const showInfo = ref(false);
const videoSrc = "./video/zamok_lastochkino_gnezdo.mp4"; // Укажите путь к вашему видео

const handleVideoEnd = () => {
  showInfo.value = true;
};

onMounted(() => {
  const video = document.querySelector('.background-video');
  video.style.opacity = 0;
  setTimeout(() => {
    video.style.opacity = 1;
  }, 0); // Немедленно запускаем анимацию проявления
  video.play();

  // Таймер для плавного скрытия видео на 5 секунде
  setTimeout(() => {
    video.style.opacity = 0;
    setTimeout(() => {
      video.pause();
    }, 1000); // Длительность плавного перехода
  }, 5000); // Задержка 5 секунд

setTimeout(()=>{
  showInfo.value = true; // Показываем информацию после остановки видео

}, 3000)


});
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 999999;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  z-index: 10;
}

.point-info {
  position: absolute;
  top: 10%;
  left: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  width: 80vw;
  background-color: white;
  color: black;
  opacity: 1;
  transition: opacity 1s ease-in-out;
  z-index: 5;
}

.point-info.show {
  opacity: 1;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

h1 {
  font-size: 2vw;
}

p {
  font-size: 1vw;
}
</style>