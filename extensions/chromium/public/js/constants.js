export const events = {
  breathIn: "BREATH_IN",
  breathOut: "BREATH_OUT",
};

export const durations = {
  in: 3000,
  out: 6000,
  cycles: 10,
  hold: 500,
  get total() {
    return this.cycles * (this.in + this.out + 2 * this.hold);
  },
};

export const breathingState = {
  running: false,
  controller: null,
  timerId: null,
  time: durations.total / 1000,
};

export const classDescriptions = {
  class: "class",
  enlargeClass: "enlargeClass",
  breathInTransitionClass: "breathInTransitionClass",
  breathOutTransitionClass: "breathOutTransitionClass",
};
