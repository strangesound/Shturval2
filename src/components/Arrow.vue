<template>
    <div class="arrow-container" v-if="currentPoint">
      <img :src="arrowSrc" class="arrow" :class="{'show': showArrow, 'hide': !showArrow}">
    </div>
  </template>
  
  <script setup>
  import { computed, watch, ref } from 'vue';
  import { defineProps } from 'vue';
  
  const props = defineProps({
    currentPoint: Object,
  });
  
  const showArrow = ref(false);
  
  const arrowSrc = computed(() => {
    return `/images/arrows/${props.currentPoint.image.toLowerCase()}_arrow.webp`;
  });
  
  watch(() => props.currentPoint, () => {
    showArrow.value = false;
    setTimeout(() => {
      showArrow.value = true;
    }, 500); // Время исчезновения старой стрелки
  });
  </script>
  
  <style scoped>
  .arrow-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .arrow {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    clip-path: circle(0% at 800px 1370px); /* Центр румбы */
    transition: opacity 0.5s ease-in-out, clip-path 1s ease-in-out;
  }
  
  .arrow.show {
    opacity: 1;
    clip-path: circle(100% at 800px 1370px); /* Центр румбы */
  }
  
  .arrow.hide {
    opacity: 0;
    clip-path: circle(0% at 800px 1370px); /* Центр румбы */
  }
  </style>