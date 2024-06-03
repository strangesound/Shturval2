<template>
    <div class="point-info">
      <h1>{{ point.city }}: {{ point.landmark }}</h1>
      <p>{{ point.description }}</p>
      <img :src="`./images/${point.image.toLowerCase()}.jpg`" alt="Фото достопримечательности">
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    point: Object
  });
  </script>
  
  <style scoped>
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
    z-index: 999;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

h1{
  font-size: 2vw;
}

p{
  font-size: 1vw;
}

  </style>