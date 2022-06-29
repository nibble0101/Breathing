/**
 * 
 * Delays for a certain number of milliseconds
 *
 * @param {duration} duration Duration in ms
 * @param {Object} options Signal options
 * @returns  Promise
 */

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

/**
 * 
 * References to delay for readability
 * 
 */

export const breathIn = delay;
export const breathOut = delay;
export const holdBreath = delay;

/**
 *
 * Formats time in the form mm:ss
 *
 * @param {Number} time Time to format in seconds
 * @returns Object
 *
 */

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


/**
 * 
 * Sets data to localStorage.
 * 
 * @param {Object} data Data you want to set to local storage in the form { key: value }
 * @returns
 */
 export const setDataToLocalStorage = async (data) => {
  await chrome.storage.local.set(data);
  return true;
};

/**
 * 
 * Get data from localStorage. If keys don't exist it returns {}
 * It doesn't throw an error if a requested key doesn't exist. The
 * non existent key will not be part of the returned object
 * 
 * @param {String[]} storagKeys Array of local storage keys.
 * @returns  Object
 */
 export const getDataFromLocalStorage = async (storagKeys) => {
  const data = await chrome.storage.local.get(storagKeys);
  return data;
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

/**
 * 
 * Gets transition classes 
 * 
 * @param {String} elementClass Base class
 * @param {Object} classDescriptions Element/Modifier
 * @returns  Object
 */

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

/**
 * 
 * Dispatche given event
 * 
 * @param {Object} eventTarget Event target
 * @param {String} eventName  Event name 
 */

export const dispatchEvent = (eventTarget, eventName) => {
  eventTarget.dispatchEvent(new Event(eventName));
};

export const initializeBeathingState = (breathingState) => {
  breathingState.running = true;
  breathingState.controller = new AbortController();
};

export const setTitle = (element, title) => {
  element.title = title;
};

export const setAriaLabel = (element, label) => {
  element.setAttribute("aria-label", label);
};
