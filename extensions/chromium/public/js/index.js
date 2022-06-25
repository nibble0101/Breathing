/*
FIXME 
Adding and removing transition class doesn't stop transition in FF
Check https://stackoverflow.com/questions/48492163/removeclass-doesnt-stop-transition-in-firefox

*/

import {
  events,
  durations,
  breathingState,
  classDescriptions,
} from "./constants.js";

import {
  breathIn,
  breathOut,
  holdBreath,
  formatTime,
  removeClass,
  removeClasses,
  setClass,
  setClasses,
  getTransitionClasses,
  resetBreathingState,
  changeElementInnerText,
  dispatchEvent,
  initializeBeathingState,
} from "./utils.js";

const controlBtn = document.getElementById("control-btn");
const dropdownBtn = document.getElementById("btn-dropdown");
const switchThemeBtn = document.getElementById("btn-switch-theme");
const closePopupBtn = document.getElementById("btn-close-popup");
const reportBugLink = document.getElementById("link-report-bug");

const body = document.getElementById("body");

const controlBtnExerciseOnClass = "ring__btn-exercise-on";

const timer = document.getElementById("timer");

const { enlargeClass, breathInTransitionClass, breathOutTransitionClass } =
  classDescriptions;

const rings = [
  {
    element: document.getElementById("ring-inner"),
    ...getTransitionClasses("ring__inner", classDescriptions),
  },
  {
    element: document.getElementById("ring-center"),
    ...getTransitionClasses("ring__center", classDescriptions),
  },
  {
    element: document.getElementById("ring-outer"),
    ...getTransitionClasses("ring__outer", classDescriptions),
  },
];

const themedElements = [
  {
    element: body,
    className: "dark-theme",
  },
  {
    element: dropdownBtn,
    className: "dark-theme",
  },
  {
    element: switchThemeBtn,
    className: "dark-theme",
  },
  {
    element: closePopupBtn,
    className: "dark-theme",
  },
  {
    element: reportBugLink,
    className: "dark-theme-report-bug-link",
  },
];

const startTimer = (breathingState) => {
  const { formattedTimeString } = formatTime(breathingState.time);
  changeElementInnerText(timer, formattedTimeString);

  breathingState.timerId = setInterval(() => {
    breathingState.time -= 1;

    const { minutes, seconds, formattedTimeString } = formatTime(
      breathingState.time
    );
    changeElementInnerText(timer, formattedTimeString);

    if (minutes === 0 && seconds === 0) {
      stopBreathingExercise();
    }
  }, 1000);
};

const stopTimer = (breathingState) => {
  clearInterval(breathingState.timerId);
};

const breathInEventTarget = new EventTarget();
const breathOutEventTarget = new EventTarget();

breathInEventTarget.addEventListener(events.breathIn, async () => {
  try {
    const { signal } = breathingState.controller;

    setClasses(rings, breathInTransitionClass);
    setClasses(rings, enlargeClass);

    await holdBreath(500, { signal });
    changeElementInnerText(controlBtn, "In");
    await breathIn(3000, { signal });

    removeClasses(rings, breathInTransitionClass);
    dispatchEvent(breathOutEventTarget, events.breathOut);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Breathing exercise aborted");
      return;
    }
    console.error(error);
  }
});

breathOutEventTarget.addEventListener(events.breathOut, async () => {
  try {
    const { signal } = breathingState.controller;

    setClasses(rings, breathOutTransitionClass);
    removeClasses(rings, enlargeClass);

    await holdBreath(500, { signal });
    changeElementInnerText(controlBtn, "Out");
    await breathOut(6000, { signal });

    removeClasses(rings, breathOutTransitionClass);
    dispatchEvent(breathInEventTarget, events.breathIn);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Breathing exercise aborted");
      return;
    }
    console.error(error);
  }
});

const startBreathingExercise = () => {
  initializeBeathingState(breathingState);

  setClass(controlBtn, controlBtnExerciseOnClass);
  setClasses(rings, breathInTransitionClass);
  startTimer(breathingState);

  dispatchEvent(breathInEventTarget, events.breathIn);
};

const stopBreathingExercise = async () => {
  breathingState.controller.abort();

  stopTimer(breathingState);

  removeClasses(rings, breathOutTransitionClass);
  removeClasses(rings, enlargeClass);
  removeClasses(rings, breathInTransitionClass);
  removeClass(controlBtn, controlBtnExerciseOnClass);

  changeElementInnerText(controlBtn, "Go");
  changeElementInnerText(timer, "00:00");

  resetBreathingState(breathingState, durations);
};

controlBtn.addEventListener("click", async () => {
  try {
    if (breathingState.running) {
      await stopBreathingExercise();
      return;
    }

    startBreathingExercise();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Breathing exercise aborted");
      return;
    }
    console.error(error);
  }
});

closePopupBtn.addEventListener("click", async () => {
  if (breathingState.running) {
    await stopBreathingExercise();
  }
  window.close();
});

switchThemeBtn.addEventListener("click", () => {
  themedElements.forEach(({ element, className }) => {
    element.classList.toggle(className);
  });
});
