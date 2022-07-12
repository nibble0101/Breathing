const setDataToLocalStorage = async (data) => {
  /*
  The storage.local.set function doesn't return promise when used
  with the chrome namespace in Firefox. Use browser namespace instead.
  Revert to chrome namesapce in MV3 for consisency.
  */
  await browser.storage.local.set(data);
  return true;
};

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await setDataToLocalStorage({ theme: "light", breathingCycles: 10 });
  } catch (error) {
    console.error(error);
  }
});
