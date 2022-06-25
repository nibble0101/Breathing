export const delay = (duration, options = {}) => {
  const { signal } = options;

  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      throw new DOMException(signal.reason, "AbortError");
    }

    const abortListener = () => {
      reject(new DOMException(signal.reason, "AbortError"));
    };

    if (signal) {
      signal.addEventListener("abort", abortListener, { once: true });
    }

    setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", abortListener);
      }

      resolve(duration);
    }, duration);
  });
};

export const breathIn = delay;
export const breathOut = delay;
export const holdBreath = delay;

export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const minutesString = `${minutes}`.padStart(2, "0");
  const secondsString = `${seconds}`.padStart(2, "0");
  return {
    minutes,
    seconds,
    formattedTimeString: `${minutesString}:${secondsString}`,
  };
};

export const removeClass = (element, className) => {
  element.classList.remove(className);
};

export const removeClasses = (elements, classDescription) => {
  elements.forEach(({ element, [classDescription]: className }) => {
    removeClass(element, className);
  });
};

export const setClass = (element, className) => {
  element.classList.add(className);
};

export const setClasses = (elements, classDescription) => {
  elements.forEach(({ element, [classDescription]: className }) => {
    setClass(element, className);
  });
};

export const getTransitionClasses = (elementClass, classDescriptions) => {
  const { enlargeClass, breathInTransitionClass, breathOutTransitionClass } =
    classDescriptions;

  return {
    class: elementClass,
    [enlargeClass]: `${elementClass}--enlarge`,
    [breathInTransitionClass]: `${elementClass}--transition-breath-in`,
    [breathOutTransitionClass]: "ring__transition-breath-out",
  };
};

export const resetBreathingState = (breathingState, durations) => {
  breathingState.running = false;
  breathingState.signal = null;
  breathingState.timerId = null;
  breathingState.time = durations.total / 1000;
};

export const changeElementInnerText = (element, text) => {
  element.innerText = text;
};

export const dispatchEvent = (eventTarget, eventName) => {
  eventTarget.dispatchEvent(new Event(eventName));
};

export const initializeBeathingState = (breathingState) => {
  breathingState.running = true;
  breathingState.controller = new AbortController();
};
