// src/utils/dragDropState.js
let lastDropTime = 0;

export function setLastDropTime() {
  lastDropTime = Date.now();
}

export function wasDropJustNow(threshold = 500) {
  return Date.now() - lastDropTime < threshold;
}
