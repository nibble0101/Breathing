/**
 * Delays for a certain number of milliseconds
 *
 * @param {duration} duration - Duration in ms
 * @param {Object} options - Signal options
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
 * References to delay for readability
 */
export const breathIn = delay;
export const breathOut = delay;
export const holdBreath = delay;

/**
 * Formats time in the form mm:ss
 *
 * @param {Number} time - Time to format in seconds
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
 * Sets data to localStorage.
 *
 * @param {Object} data - Data you want to set to local storage in the form { key: value }
 * @returns Boolean
 */
export const setDataToLocalStorage = async (data) => {
  await chrome.storage.local.set(data);
  return true;
};

/**
 * Get data from localStorage. If keys don't exist it returns {}
 * It doesn't throw an error if a requested key doesn't exist. The
 * non existent key will not be part of the returned object
 *
 * @param {String[]} storagKeys - Array of local storage keys.
 * @returns  Object
 */
export const getDataFromLocalStorage = async (storagKeys) => {
  const data = await chrome.storage.local.get(storagKeys);
  return data;
};

/**
 * Removes class from a given DOM element
 * 
 * @param {Object} element - DOM element
 * @param {String} className - Class name
 */
export const removeClass = (element, className) => {
  element.classList.remove(className);
};

/**
 * Remove class with given description from array of DOM elements
 * 
 * @param {Array} elements - An array of DOM elements
 * @param {String} classDescription - Description of class to be removed
 */
export const removeClasses = (elements, classDescription) => {
  elements.forEach(({ element, [classDescription]: className }) => {
    removeClass(element, className);
  });
};

/**
 * Adds class to a given DOM element
 * 
 * @param {Object} element - DOM element
 * @param {String} className - Class name
 */
export const setClass = (element, className) => {
  element.classList.add(className);
};

/**
 * Adds class with given description to array of DOM elements
 * 
 * @param {Array} elements - An array of DOM elements
 * @param {String} classDescription - Description of class to be added
 */
export const setClasses = (elements, classDescription) => {
  elements.forEach(({ element, [classDescription]: className }) => {
    setClass(element, className);
  });
};

/**
 * Gets transition classes
 *
 * @param {String} elementClass - Base class
 * @param {Object} classDescriptions - Element/Modifier
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

/**
 * Sets the inner text of a DOM element
 *
 * @param {Object} element - DOM element
 * @param {String} text - Text
 */
export const setElementInnerText = (element, text) => {
  element.innerText = text;
};

/**
 * Dispatche given event
 *
 * @param {Object} eventTarget - Event target
 * @param {String} eventName - Event name
 */
export const dispatchEvent = (eventTarget, eventName) => {
  eventTarget.dispatchEvent(new Event(eventName));
};

/**
 * Make updates to the current state
 *
 * @param {Object} currentState - The current state
 * @param {Object} updates - Updates
 */
export const updateState = (currentState, updates) => {
  for (const prop in updates) {
    currentState[prop] = updates[prop];
  }
};

/**
 * Sets DOM element attribute
 *
 * @param {Object} element - DOM element
 * @param {String} attributeName - Valid element attribute
 * @param {String} attributeValue - Attribute value
 */
export const setAttribute = (element, attributeName, attributeValue) => {
  element.setAttribute(attributeName, attributeValue);
};

/**
 * Retrieves messages from message.json file for updating UI
 *
 * @param {Object} messages - Message names for updating UI
 */
export const getMessages = (messages) => {
  for (const messageName in messages) {
    messages[messageName].message = chrome.i18n.getMessage(messageName);
  }
};
