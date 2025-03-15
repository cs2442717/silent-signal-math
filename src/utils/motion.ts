
// Utility for detecting device motion (shake)

type ShakeCallback = () => void;

const SHAKE_THRESHOLD = 15;
const SHAKE_TIMEOUT = 1000;
const SHAKE_DEBOUNCE = 5000;

let lastTime = 0;
let lastX = 0;
let lastY = 0;
let lastZ = 0;
let shakeCallback: ShakeCallback | null = null;
let lastShake = 0;

const onDeviceMotion = (event: DeviceMotionEvent) => {
  const current = Date.now();
  const diffTime = current - lastTime;

  if (diffTime > SHAKE_TIMEOUT) {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;
    
    const x = acceleration.x || 0;
    const y = acceleration.y || 0;
    const z = acceleration.z || 0;
    
    const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
    
    if (speed > SHAKE_THRESHOLD && current - lastShake > SHAKE_DEBOUNCE) {
      lastShake = current;
      shakeCallback?.();
    }
    
    lastTime = current;
    lastX = x;
    lastY = y;
    lastZ = z;
  }
};

export const startShakeDetection = (callback: ShakeCallback): void => {
  lastTime = 0;
  shakeCallback = callback;
  
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
  }
};

export const stopShakeDetection = (): void => {
  if (window.DeviceMotionEvent) {
    window.removeEventListener('devicemotion', onDeviceMotion);
  }
  
  shakeCallback = null;
};
