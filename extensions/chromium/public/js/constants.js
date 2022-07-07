export const events = {
  breathIn: "BREATH_IN",
  breathOut: "BREATH_OUT",
};

/**
 * These figures should correspond with
 * the CSS transition durations. If you
 * change any value here, do update the 
 * corresponding CSS transition duration.
 * Consider retrieving some of these values
 * from CSS variables.
 */
export const durations = {
  /**
   * Breath in duration
   */
  in: 3000,

  /** 
   * Breath out duration 
   */
  out: 6000,

  /**
   * Breathing cycles. Default is 10.
   * User can change this from options
   * page. Retrieve the value user has
   * set from storage.local and update
   * in DOMContentLoaded event handler
   */
  cycles: 10,

  /**
   * Pause breathing duration. At the 
   * end of each breath-in or breath-out. 
   */
  hold: 500,

  /**
   * Retrieves the duration for a breathing 
   * session in seconds.
   */
  get total() {
    const totalInMs = this.cycles * (this.in + this.out + 2 * this.hold);
    return totalInMs / 1000;
  },
};

export const initialBreathingState = {
  running: false,
  controller: null,
  timerId: null,
  isDarkTheme: false,
  time: null,
  isDropdownOpen: false,
};

export const classDescriptions = {
  class: "class",
  enlargeClass: "enlargeClass",
  breathInTransitionClass: "breathInTransitionClass",
  breathOutTransitionClass: "breathOutTransitionClass",
};

export const messages = {
  defaultControlBtnText: {},
  breathInText: {},
  breathOutText: {},
  reportBugAnchorText: {},
  aboutMenuText: {},
  keyboardShortcutMenuText: {},
  openMenuTitleText: {},
  closeMenuTitleText: {},
  openMenuAriaLabel: {},
  closeMenuAriaLabel: {},
  toggleDarkThemeTitleText: {},
  toggleLightThemeTitleText: {},
  toggleDarkThemeAriaLabel: {},
  toggleLightThemeAriaLabel: {},
  closePopupTitleText: {},
  closePopupAriaLabel: {},
};
