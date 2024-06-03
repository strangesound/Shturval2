import { reactive } from 'vue';
import { io } from 'socket.io-client';

const state = reactive({
  currentValue: 0
});

const socket = io('http://localhost:3000');

socket.on('modbus-data', (data) => {
  state.currentValue = data;
});

export default state;