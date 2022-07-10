const formEl = document.getElementById("form");
const sessionCount = document.getElementById("session-count");
const notificationEl = document.getElementById("notification");
const label = document.getElementById("label");
const submitBtn = document.getElementById("submit-btn");

const state = {
  timeoutId: null,
  cachedBreathingCycles: 10,
};

const messages = {
  breathingCountLabelText: {},
  saveSettingsButtonText: {},
  successMessage: {},
};

const setDataToLocalStorage = async (data) => {
  await chrome.storage.local.set(data);
};

const getDataFromLocalStorage = async (storagKeys) => {
  const data = await chrome.storage.local.get(storagKeys);
  return data;
};

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const { value } = sessionCount;

    /**
     * Do not save breathingCycles to localStorage unless
     * the value being saved  is different from value
     * already in localStorage.
     */
    if (parseInt(value) === state.cachedBreathingCycles) return;

    /**
     * Check whether notification is on by checking whether timer
     * is still running.
     */
    if (state.timeoutId) {
      clearInterval(state.timeoutId);
      state.timeoutId = null;
      notificationEl.classList.remove("display-block");
    }

    await setDataToLocalStorage({
      breathingCycles: parseInt(value),
    });

    /**
     * Cache the updated breathing cycles.
     */
    state.cachedBreathingCycles = parseInt(value);

    /**
     * Display notification message.
     */
    notificationEl.classList.add("display-block");

    /**
     * Remove notififcation message after a short duration
     */
    state.timeoutId = setTimeout(() => {
      notificationEl.classList.remove("display-block");
      state.timeoutId = null;
    }, 2000);
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { breathingCycles } = await getDataFromLocalStorage([
      "breathingCycles",
    ]);

    if (breathingCycles) {
      /**
       * Cache breathing cycles currently in localStorage to
       * prevent writing to storage unnecessarily.
       */
      state.cachedBreathingCycles = parseInt(breathingCycles);

      /**
       * Set value of input elemet to the value from local
       * storage.
       */
      sessionCount.value = breathingCycles;
    }

    /**
     * Retrieving localized messages
     */
    for (const messageName in messages) {
      messages[messageName].message = chrome.i18n.getMessage(messageName);
    }

    console.log(messages);
    /**
     * Updating contents of options UI with localized messages
     */
    label.textContent = messages.breathingCountLabelText.message;
    submitBtn.textContent = messages.saveSettingsButtonText.message;
    notificationEl.textContent = messages.successMessage.message;
  } catch (error) {
    console.error(error);
  }
});
