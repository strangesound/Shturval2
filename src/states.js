import { ref } from 'vue';

const states = {
  MAP: 'map',
  POINT_INFO: 'point_info',
  SCREENSAVER: 'screensaver'
};

const currentState = ref(states.MAP);
const interactionBlocked = ref(false);

function setState(state) {
  currentState.value = state;
  // console.log('currentState.value', currentState.value);

  if (state === states.MAP) {
    interactionBlocked.value = true; // Блокируем взаимодействия
    console.log('Interaction Blocked');

    setTimeout(() => {
      interactionBlocked.value = false; // Снимаем блокировку через 4 секунды
      console.log('Interaction unblocked');
    }, 1500);
  }
}

function isInteractionBlocked() {
  return interactionBlocked.value;
}

export { states, currentState, setState, isInteractionBlocked };
