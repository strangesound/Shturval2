import { reactive } from 'vue';
import { io } from 'socket.io-client';

const shturval = reactive({
  currentValue: 0
});

const socket = io('http://localhost:3000');

socket.on('modbus-data', (data) => {
  shturval.currentValue = data;
});

export default shturval;