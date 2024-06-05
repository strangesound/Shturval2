import { ref } from 'vue';

const states = {
  MAP: 'map',
  POINT_INFO: 'point_info',
  SCREENSAVER: 'screensaver'
};

const currentState = ref(states.MAP);

function setState(state) {
  currentState.value = state;
  console.log('currentState.value', currentState.value);
}

export { states, currentState, setState };
