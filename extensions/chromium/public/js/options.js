const formEl = document.getElementById("form");
const sessionCount = document.getElementById("session-count");

const setDataToLocalStorage = async (data) => {
  await chrome.storage.local.set(data);
};

const getDataFromLocalStorage = async (storagKeys) => {
  const data = await chrome.storage.local.get(storagKeys);
  return data;
};

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { value } = sessionCount;
  try {
    await setDataToLocalStorage({
      breathingCycles: value ? parseInt(value) : 10,
    });
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const { breathingCycles } = await getDataFromLocalStorage([
    "breathingCycles",
  ]);
  
  if (breathingCycles) {
    sessionCount.value = breathingCycles;
  }
});
