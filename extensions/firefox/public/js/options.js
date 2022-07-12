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
  /*
   * The storage.local.set function doesn't return promise when used
   * with the chrome namespace in Firefox. Use browser namespace instead.
   * Revert to chrome namesapce in MV3 for consisency.
   */
  await browser.storage.local.set(data);
  return true;
};

const getDataFromLocalStorage = async (storagKeys) => {
  /*
   * The storage.local.get function doesn't return promise when used
   * with the chrome namespace in Firefox MV2. Use browser namespace instead.
   * Revert to chrome namespace in MV3 for consisency.
   */
  const data = await browser.storage.local.get(storagKeys);
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

chrome.storage.onChanged.addListener((changes) => {
  const { theme } = changes;
  if (!theme) return;

  if (theme.newValue === "dark") {
    document.body.classList.add("dark-theme");
    return;
  }

  document.body.classList.remove("dark-theme");
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { theme, breathingCycles } = await getDataFromLocalStorage([
      "breathingCycles",
      "theme",
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

    /**
     * Updating contents of options UI with localized messages
     */
    label.textContent = messages.breathingCountLabelText.message;
    submitBtn.textContent = messages.saveSettingsButtonText.message;
    notificationEl.textContent = messages.successMessage.message;

    /**
     * Switch to dark theme is theme has been set to "dark"
     */
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    }
  } catch (error) {
    console.error(error);
  }
});
