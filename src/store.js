import { reactive } from 'vue';
import { io } from 'socket.io-client';

const shturval = reactive({
  currentValue: 0
});

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('modbus-data', (data) => {
  shturval.currentValue = data;
  console.log('Received modbus-data:', data);
});

socket.on("disconnect", (reason, details) => {
  // the reason of the disconnection, for example "transport error"
  console.log(reason);

  // the low-level reason of the disconnection, for example "xhr post error"
  console.log(details.message);

  // some additional description, for example the status code of the HTTP response
  console.log(details.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(details.context);
});


export default shturval;
