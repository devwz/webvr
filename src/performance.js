export function createPerformanceMeter(element) {
  let frames = 0;
  let startedAt = performance.now();
  let latestFps = 0;

  return {
    tick(now) {
      frames += 1;
      const elapsed = now - startedAt;
      if (elapsed < 1000) return;

      latestFps = Math.round((frames * 1000) / elapsed);
      element.textContent = `${latestFps} FPS`;
      frames = 0;
      startedAt = now;
    },
    get fps() {
      return latestFps;
    },
  };
}
