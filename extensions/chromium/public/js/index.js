/*
FIXME 
Adding and removing transition class doesn't stop transition in FF
Check https://stackoverflow.com/questions/48492163/removeclass-doesnt-stop-transition-in-firefox

*/

import {
  events,
  durations,
  classDescriptions,
  messages,
  initialBreathingState,
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
  setElementInnerText,
  dispatchEvent,
  getDataFromLocalStorage,
  setDataToLocalStorage,
  setAttribute,
  updateState,
  getMessages,
} from "./utils.js";

const controlBtn = document.getElementById("control-btn");
const dropdownBtn = document.getElementById("btn-dropdown");
const dropdown = document.getElementById("dropdown");
const switchThemeBtn = document.getElementById("btn-switch-theme");
const closePopupBtn = document.getElementById("btn-close-popup");
const reportBugLink = document.getElementById("link-report-bug");
const timer = document.getElementById("timer");
const body = document.getElementById("body");

const controlBtnExerciseOnClass = "ring__btn-exercise-on";

const { enlargeClass, breathInTransitionClass, breathOutTransitionClass } =
  classDescriptions;

const breathingState = { ...initialBreathingState };

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
    element: dropdown,
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

/**
 * Triggers countdown and updates the timer on UI
 *
 * @param {Object} breathingState Breathing state
 */
const startTimer = (breathingState) => {
  const { formattedTimeString } = formatTime(breathingState.time);
  setElementInnerText(timer, formattedTimeString);

  breathingState.timerId = setInterval(() => {
    breathingState.time -= 1;

    const { minutes, seconds, formattedTimeString } = formatTime(
      breathingState.time
    );
    setElementInnerText(timer, formattedTimeString);

    if (minutes === 0 && seconds === 0) {
      stopBreathingExercise();
    }
  }, 1000);
};

/**
 * Switch theme
 */
const switchTheme = () => {
  themedElements.forEach(({ element, className }) => {
    element.classList.toggle(className);
  });

  if (breathingState.isDarkTheme) {
    setAttribute(
      switchThemeBtn,
      "title",
      messages.toggleLightThemeTitleText.message
    );
    setAttribute(
      switchThemeBtn,
      "aria-label",
      messages.toggleLightThemeAriaLabel.message
    );
  } else {
    setAttribute(
      switchThemeBtn,
      "title",
      messages.toggleDarkThemeTitleText.message
    );
    setAttribute(
      switchThemeBtn,
      "aria-label",
      messages.toggleDarkThemeAriaLabel.message
    );
  }
};

/**
 * Stops the timer
 *
 * @param {Object} breathingState Breathing state
 */

const stopTimer = (breathingState) => {
  clearInterval(breathingState.timerId);
};

/**
 * Initializes the UI
 */

const initUI = () => {
  setAttribute(dropdownBtn, "title", messages.closeMenuTitleText.message);
  setAttribute(dropdownBtn, "aria-label", messages.closeMenuAriaLabel.message);

  setAttribute(
    switchThemeBtn,
    "title",
    messages.toggleDarkThemeTitleText.message
  );
  setAttribute(
    switchThemeBtn,
    "aria-label",
    messages.toggleDarkThemeAriaLabel.message
  );

  setAttribute(closePopupBtn, "title", messages.closePopupTitleText.message);
  setAttribute(
    closePopupBtn,
    "aria-label",
    messages.closePopupAriaLabel.message
  );

  controlBtn.textContent = messages.defaultControlBtnText.message;

  reportBugLink.textContent = messages.reportBugAnchorText.message;
};

// Breath in and breath out event targets
const breathInEventTarget = new EventTarget();
const breathOutEventTarget = new EventTarget();

breathInEventTarget.addEventListener(events.breathIn, async () => {
  try {
    // Pass signal to every abortable async operation.
    // Aborts the operation in case user closes popup
    // or aborts an onging breathing exercise.
    const { signal } = breathingState.controller;

    // Sets breath in transition classes because the
    // transition time for breath out is different
    // from breath in.
    setClasses(rings, breathInTransitionClass);

    // Set enlarge class so that the rings enlarge
    // to their maximum size during breath in.
    setClasses(rings, enlargeClass);

    // Hold breath at the start of breath in. This pause
    // should be the same as the transition delay in CSS.
    await holdBreath(500, { signal });

    // Set control button inner text to "In" during
    // breath in.
    setElementInnerText(controlBtn, "In");

    // Wait as user breaths in. This breath in time
    // should be the same as the longest transition
    // duration in CSS - duration for outer ring.
    await breathIn(3000, { signal });

    removeClasses(rings, breathInTransitionClass);

    // Dispatch event to trigger breath out.
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
    // Pass signal to every abortable async operation.
    // Aborts the operation in case user closes popup
    // or aborts an onging breathing exercise.
    const { signal } = breathingState.controller;

    // Sets breath out transition classes because the
    // transition time for breath-out is different
    // from breath-in.
    setClasses(rings, breathOutTransitionClass);

    // Removes enlarge class so that the rings collapse
    // to their original size during breath out.
    removeClasses(rings, enlargeClass);

    // Hold breath at the start of breath- out. This pause
    // should be the same as the transition delay in CSS.
    await holdBreath(500, { signal });

    // Change control button inner text to "Out" during
    // breath out
    setElementInnerText(controlBtn, "Out");

    // Wait as user breaths out. This breath out time
    // should be the same as the breath out transition
    // duration in CSS.
    await breathOut(6000, { signal });

    // Remove breath out transition classes at the end
    // of breath out to stop further expansion of rings.
    removeClasses(rings, breathOutTransitionClass);

    // Dispatch event to trigger breath in.
    dispatchEvent(breathInEventTarget, events.breathIn);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Breathing exercise aborted");
      return;
    }
    console.error(error);
  }
});

/**
 *
 * Starts the breathing exercise
 *
 */
const startBreathingExercise = () => {
  // Initializing breathing state
  updateState(breathingState, {
    running: true,
    controller: new AbortController(),
  });

  setClass(controlBtn, controlBtnExerciseOnClass);
  setClasses(rings, breathInTransitionClass);
  startTimer(breathingState);

  dispatchEvent(breathInEventTarget, events.breathIn);
};

/**
 *
 * Stops the breathing exercise and resets state
 *
 */
const stopBreathingExercise = async () => {
  breathingState.controller.abort();

  stopTimer(breathingState);

  removeClasses(rings, breathOutTransitionClass);
  removeClasses(rings, enlargeClass);
  removeClasses(rings, breathInTransitionClass);
  removeClass(controlBtn, controlBtnExerciseOnClass);

  setElementInnerText(controlBtn, "Go");
  setElementInnerText(timer, "00:00");

  // Reset breathing state
  updateState(breathingState, {
    running: false,
    signal: null,
    timerId: null,
    time: durations.total / 1000,
  });
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

switchThemeBtn.addEventListener("click", async () => {
  updateState(breathingState, { isDarkTheme: !breathingState.isDarkTheme });
  switchTheme();

  if (breathingState.isDarkTheme) {
    await setDataToLocalStorage({ theme: "dark" });
  } else {
    await setDataToLocalStorage({ theme: "light" });
  }
});

dropdownBtn.addEventListener("click", (event) => {
  if (dropdown.classList.contains("display-block")) {
    removeClass(dropdown, "display-block");
    setAttribute(dropdownBtn, "title", messages.openMenuTitleText.message);
    setAttribute(dropdownBtn, "aria-label", messages.openMenuAriaLabel.message);
  } else {
    setClass(dropdown, "display-block");
    setAttribute(dropdownBtn, "title", messages.closeMenuTitleText.message);
    setAttribute(
      dropdownBtn,
      "aria-label",
      messages.closeMenuAriaLabel.message
    );
  }
});

/**
 *
 * We need to remove the dropdown menu
 * when user clicks anywhere when the
 * dropdown is open. Therefore, we need
 * to check whether the clicked element
 * is the dropdown button or one of its
 * descendants. If it is, we do nothing
 * because there is an event handler for
 * the button and its descendants. If it
 * is not the dropdown button, check whether
 * the dropdown is open. If open, close it
 * otherwise do nothing
 *
 */

body.addEventListener("click", (event) => {
  const { id } = event.target;
  if (id === "btn-dropdown" || id === "hamburger-icon-wrapper") return;
  if (dropdown.classList.contains("display-block")) {
    removeClass(dropdown, "display-block");
    setAttribute(dropdownBtn, "title", messages.openMenuTitleText.message);
    setAttribute(dropdownBtn, "aria-label", messages.openMenuAriaLabel.message);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const { theme, breathingCycles } = await getDataFromLocalStorage([
    "theme",
    "breathingCycles",
  ]);

  if (breathingCycles) {
    durations.cycles = breathingCycles;
  }

  updateState(breathingState, { time: durations.total / 1000 });
  getMessages(messages);

  if (theme === "dark") {
    updateState(breathingState, { isDarkTheme: true });
    switchTheme();
  }

  initUI();
});
