<template>
    <div class="wrapper">
        <video class="back" muted loop autoplay playsinline src="/video/all.mp4"></video>
        <!-- <video class="ship" muted loop autoplay playsinline src="/video/zamok_lastochkino_gnezdo.webm"></video> -->
        <img src="/images/screenSaverText.webp" alt="" class="header-img">
    </div>
</template>

<script setup>

</script>

<style scoped>
.wrapper {
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    color: white;
    font-size: 5vw;
    z-index: 999;
    overflow: hidden;
    /* background-image: url("/images/screensaver.webp"); */
}

.header-img {
    position: absolute;
    left: 0;
    top: 0;
}

.ship,
.back {
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    object-fit: cover;
}
</style>