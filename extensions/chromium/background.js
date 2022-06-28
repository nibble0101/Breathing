const setDataToLocalStorage = async (data) => {
  await chrome.storage.local.set(data);
};

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await setDataToLocalStorage({ theme: "light" });
  } catch (error) {
    console.error(error);
  }
});
