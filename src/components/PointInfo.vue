<template>
  <div class="container">
    <div class="point-info">
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
        <p class="scores" :style="{ opacity: opacityValue }">{{ props.score.toFixed() }} {{ getDeclension(props.score)
          }}</p>
        <div class="courseArrowBrown" :style="{ transform: `rotate(${degrees}deg)` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const opacityValue = ref(0);
const degrees = ref(-30);

const props = defineProps({
  point: Object,
  score: Number
});

function getDeclension(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "баллов";
  }
  if (lastDigit === 1) {
    return "балл";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "балла";
  }
  return "баллов";
}

console.log(getDeclension(props.score));


function scoreToDegrees(score) {
  const minScore = 40;
  const maxScore = 100;
  const minDegrees = -30;
  const maxDegrees = 30;

  // Проверка, что балл находится в диапазоне от 40 до 100
  if (score < minScore || score > maxScore) {
    throw new Error("Score must be between 40 and 100");
  }

  // Линейная интерполяция для перевода баллов в градусы
  const degrees = Math.round(((score - minScore) / (maxScore - minScore)) * (maxDegrees - minDegrees) + minDegrees);
  console.log('degrees', degrees);
  return degrees;
}
onMounted(() => {

  setTimeout(() => {
    opacityValue.value = 1;
    degrees.value = scoreToDegrees(props.score)
  }, 200); // Изменение opacity через 2 секунды
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
  z-index: 1;
  background-color: transparent !important;
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
  /* color: black; */
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

.course-container {
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
  transform: rotate(-30deg);
  transition: transform 1s ease-in-out;
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
  font-weight: 700;
  color: var(--brown);
  opacity: 0;
  transition: opacity 2s ease;

}
</style>