const SCROLL_MIN_DELTA = 200

export function usePageScroll(
  pages: HTMLElement[],
  speed: number,
  animation = true
) {
  let current = 0
  let sumDelta = 0
  let lastTime = 0
  let isDown = false
  let touchstart: { X: number; Y: number } = { X: 0, Y: 0 }
  let top: number | null = null

  function getTop() {
    return top === null ? getOffset(current) : top
  }

  function getOffset(index: number) {
    const box = pages[index].getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    const clientTop = document.documentElement.clientTop || document.body.clientTop || 0;
    const top = box.top + scrollTop - clientTop;

    return top
  }

  function up() {
    current = Math.max(current - 1, 0)
  }

  function down() {
    current = Math.min(current + 1, pages.length - 1)
  }

  function to(id: string | number) {
    if (typeof id === "string") {
      const index = pages.findIndex(p => p.id === id);

      if (index !== -1) {
        current = index;
      }
    } else if (typeof id === "number" && id >= 0 && id < pages.length) {
      current = id;
    }
    top = null
  }

  function compensateTime(t: number) {
    const k = 0.9;
    function f(x: number) {
      return Math.pow(k, x) / Math.log(k);
    }

    return (f(t) - f(0)) / (-f(0));
  }

  function autoScroll() {
    requestAnimationFrame(() => autoScroll());

    const time = new Date().getTime();

    const delta = (getTop() - window.scrollY) * speed;
    const deltaTime = compensateTime(time - lastTime);

    if (animation)
      window.scrollTo(0, window.scrollY + Math.floor(delta) * deltaTime)

    lastTime = time;
  }

  function canScroll(e: Event) {
    const wheel = e as WheelEvent & { path: HTMLElement[] }
    const path = wheel.path.slice(0, wheel.path.indexOf(document.body))
    const delta = wheel.deltaY ? wheel.deltaY : wheel.detail;

    return !path.find(el =>
      (delta < 0 && Math.ceil(el.scrollTop) > 0 || delta > 0 && Math.ceil(el.scrollTop) + el.clientHeight < el.scrollHeight)
      && el !== document.body
      && getComputedStyle(el).overflow !== 'hidden')
  }

  function mousewheel(e: Event) {
    const wheel = e as WheelEvent & { path: HTMLElement[] }
    const delta = wheel.deltaY ? wheel.deltaY : wheel.detail;

    if (!canScroll(e)) return

    if (sumDelta == 0) {
      if (delta < 0)
        up();
      else
        down();
    }

    sumDelta += delta;

    if (Math.abs(sumDelta) >= SCROLL_MIN_DELTA)
      sumDelta = 0;
  }

  function resize() {
    to(current);
  }

  function keydown(e: KeyboardEvent) {
    if (e.keyCode == 32)
      down();
    else if (e.keyCode == 37 || e.keyCode == 38)
      up();
    else if (e.keyCode == 39 || e.keyCode == 40)
      down();
  }


  function ondown(e: MouseEvent | TouchEvent) {
    const event: MouseEvent | Touch = 'touches' in e ? e.touches[0] : e

    touchstart = { X: event.pageX, Y: event.pageY };
    if (canScroll(e)) {
      isDown = true;
    }
  }

  function onup() {
    const distances = pages.map((_p, i) => getOffset(i)).map((a) => { return Math.abs(getTop() - a); });
    const minDistance = distances.reduce((a, b) => { return Math.min(a, b); });

    to(distances.indexOf(minDistance));

    isDown = false;
  }

  function onmove(e: MouseEvent | TouchEvent) {
    if (!isDown) return;
    const event: MouseEvent | Touch = 'touches' in e ? e.touches[0] : e

    if (e.type == "mousemove" && (e.target as HTMLElement).tagName != "INPUT")
      e.preventDefault();

    top = getTop() + (touchstart.Y - event.pageY);

    touchstart = { X: event.pageX, Y: event.pageY };
  }

  function mount() {
    document.body.addEventListener("mousewheel", mousewheel, { passive: true });
    document.body.addEventListener("DOMMouseScroll", mousewheel, { passive: true });
    window.addEventListener('resize', () => resize());
    document.addEventListener('keydown', e => keydown(e));
    document.addEventListener('touchstart', ondown);
    document.addEventListener('touchmove', onmove);
    document.addEventListener('touchcancel', onup);
    document.addEventListener('touchend', onup);

    document.addEventListener('mousedown', ondown);
    document.addEventListener('mousemove', onmove);
    document.addEventListener('mouseup', onup);

    // document.body.style.overflow = 'hidden';

    resize();

    to(location.hash.replace('#', ''));
    autoScroll();
  }

  function destroy() {
    document.body.removeEventListener("mousewheel", mousewheel);
    document.body.removeEventListener("DOMMouseScroll", mousewheel);
    window.removeEventListener('resize', resize);
    document.removeEventListener('keydown', keydown);
    document.removeEventListener('touchstart', ondown);
    document.removeEventListener('touchmove', onmove);
    document.removeEventListener('touchcancel', onup);
    document.removeEventListener('touchend', onup);

    document.removeEventListener('mousedown', ondown);
    document.removeEventListener('mousemove', onmove);
    document.removeEventListener('mouseup', onup);
  }

  return {
    up,
    down,
    mount,
    destroy
  }
}
