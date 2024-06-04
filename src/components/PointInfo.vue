<template>
  <div class="container">
    <video ref="video" class="background-video" :src="videoSrc" @ended="handleVideoEnd" autoplay muted
      playsinline></video>
    <div v-if="showInfo" class="point-info">
      <img class="landmark-img" :src="`./images/landmarks/${point.image.toLowerCase()}.jpg`">
      <div class="svitok"></div>

      <div class="all-text">
        <h1>{{ point.landmark }}</h1>
        <h2>• {{ point.city }} •</h2>
        <p>{{ point.description }}</p>
      </div>

      <div class="course-container">
        <div class="course"></div>
        <p class="kurs-precision">точность курса</p>
        <p class="scores">83 балла</p>
        <div class="courseArrowBrown"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  point: Object
});

const showInfo = ref(false);
const videoSrc = `./video/zamok_lastochkino_gnezdo.mp4`; // Укажите путь к вашему видео
// const videoSrc = `./video/${props.point.image.toLowerCase()}.mp4`; // Укажите путь к вашему видео

let interactionBlocked = true;
const unblockInteraction = () => {
  interactionBlocked = false;
};

const handleVideoEnd = () => {
  setTimeout(() => {
    showInfo.value = true;
    unblockInteraction();
  }, 2000); // Плавный переход после видео
};

onMounted(() => {
  const video = document.querySelector('.background-video');
  setTimeout(() => {
    video.style.opacity = 1;
  }, 0); // Немедленно запускаем анимацию проявления
  video.play();

  // Таймер для плавного скрытия видео на 5 секунде
  setTimeout(() => {
    // video.style.opacity = 0;
    setTimeout(() => {
      video.pause();
      showInfo.value = true; // Показываем информацию после остановки видео
    }, 1000); // Длительность плавного перехода
  }, 5000); // Задержка 5 секунд

  setTimeout(unblockInteraction, 7000); // Разблокировка взаимодействия через 7 секунд
});


onBeforeUnmount(() => {
  interactionBlocked = false; // Разблокировка при демонтировании компонента
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
  z-index: 2;
}

.point-info {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  justify-content: top;
  padding-top: 40vh;
  color: black;
  opacity: 1;
  transition: opacity 1s ease-in-out;
  z-index: 5;
}

.svitok {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url("/images/landmarks/ui/landmark-papier.png");
  z-index: -1;

}


.point-info.show {
  opacity: 1;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.landmark-img {
  width: 23vw;
  height: 15vw;
  position: absolute;
  left: 36.458vw;
  top: 4.688vw;
  object-fit: fill;
  z-index: -2;
}

.course {
  z-index: 6;
  width: 23.438vw;
  height: 4.896vw;
  margin-top: 4.896vw;
  background-image: url("/images/landmarks/ui/kurs.png");

}

.course-container{
  position: relative;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.courseArrowBrown {
  position: absolute;
  z-index: 6;
  width: 46.51vw;
  height: 46.51vw;
  margin-top: 5vw;
  background-image: url("/images/landmarks/ui/kursArrow.png");
  rotate: 13deg;
}

h1 {
  font-size: 1.432vw;
  color: var(--brown);
  letter-spacing: .15vw;
}

h2 {
  font-size: 1.172vw;
  color: var(--brown);
  line-height: 2;
  letter-spacing: .15vw;

}

p {
  color: var(--black);
  font-weight: 300;
  font-size: 1.172vw;
  font-size: 1vw;
  line-height: 1.2;
  max-width: 35.599vw;
}

.kurs-precision {
  font-size: 1.172vw;
  color: var(--brown);
  font-weight: 700;
  margin-top: -2vh;
}

.scores {
  font-size: 4.635vw;
  color: var(--brown);

  font-weight: 700;
}
</style>