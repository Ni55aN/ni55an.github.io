export class PageScroll {
  heights: number[] = []
  ids: string[] = []
  animation = true
  current = 0
  SPEED = 1 / 10
  SCROLL_MIN_DELTA = 200
  sum_delta = 0
  top = 0
  last_time = 0
  windowHeight = 0
  isDown = false
  touchstart: { X: number; Y: number } = { X: 0, Y: 0 }

  constructor(private pages: HTMLElement[]) { }

  up() {
    if (this.current > 0) {
      this.top -= this.pages[this.current - 1].clientHeight;
      this.current--;
    }
    
  }

  down() {
    if (this.current + 1 < this.pages.length) {
      this.top += this.pages[this.current].clientHeight;
      this.current++;
    }
  }

  to(id: string | number) {
    if (typeof id === "string") {
      var index = this.ids.indexOf(id);

      if (index !== -1) {
        this.top = this.heights[index];
        this.current = index;
      }
    } else if (typeof id === "number" && id >= 0 && id < this.heights.length) {
      this.top = this.heights[id];
      this.current = id;
    }
  }

  compensateTime(t: number) {
    var k = 0.9;
    function f(x: number) {
      return Math.pow(k, x) / Math.log(k);
    }

    return (f(t) - f(0)) / (-f(0));
  }

  autoScroll() {
    requestAnimationFrame(() => this.autoScroll());

    var time = new Date().getTime();

    var delta = (this.top - window.scrollY) * this.SPEED;
    var delta_time = this.compensateTime(time - this.last_time);

    if (this.animation)
      window.scrollTo(0, window.scrollY + Math.floor(delta) * delta_time)

    this.last_time = time;
  }

  canScroll(e: Event) {
    const wheel = e as WheelEvent & { path: HTMLElement[] }
    const path = wheel.path.slice(0, wheel.path.indexOf(document.body))
    const delta = wheel.deltaY ? wheel.deltaY : wheel.detail;

    return !path.find(el =>
      (delta < 0 && Math.ceil(el.scrollTop) > 0 || delta > 0 && Math.ceil(el.scrollTop) + el.clientHeight < el.scrollHeight)
      && el !== document.body
      && getComputedStyle(el).overflow !== 'hidden')
  }

  mousewheel = (e: Event) => {
    const wheel = e as WheelEvent & { path: HTMLElement[] }
    const delta = wheel.deltaY ? wheel.deltaY : wheel.detail;

    if (!this.canScroll(e)) return

    if (this.sum_delta == 0) {
      if (delta < 0)
        this.up();
      else
        this.down();
    }

    this.sum_delta += delta;

    if (Math.abs(this.sum_delta) >= this.SCROLL_MIN_DELTA)
      this.sum_delta = 0;
  }

  resize = () => {
    this.top = Math.floor(this.top * window.innerHeight / this.windowHeight);

    this.windowHeight = window.innerHeight;

    this.heights[0] = 0;

    for (var i = 1; i < this.pages.length; i++)
      this.heights[i] = this.pages[i - 1].clientHeight + this.heights[i - 1];

    this.to(this.current);
  }

  keydown = (e: KeyboardEvent) => {
    if (e.keyCode == 32)
      this.down();
    else if (e.keyCode == 37 || e.keyCode == 38)
      this.up();
    else if (e.keyCode == 39 || e.keyCode == 40)
      this.down();
  }


  ondown = (e: MouseEvent | TouchEvent) => {
    var event: MouseEvent | Touch = 'touches' in e ? e.touches[0] : e

    this.touchstart = { X: event.pageX, Y: event.pageY };
    if (this.canScroll(e)) {
      this.isDown = true;
    }
  }

  onup = (e: MouseEvent | TouchEvent) => {
    var distances = this.heights.map((a) => { return Math.abs(this.top - a); });
    var minDistance = distances.reduce((a, b) => { return Math.min(a, b); });

    this.to(distances.indexOf(minDistance));

    this.isDown = false;
  }

  onmove = (e: MouseEvent | TouchEvent) => {
    if (!this.isDown) return;
    var event: MouseEvent | Touch = 'touches' in e ? e.touches[0] : e

    if (e.type == "mousemove" && (e.target as HTMLElement).tagName != "INPUT")
      e.preventDefault();

    this.top += this.touchstart.Y - event.pageY;

    this.touchstart = { X: event.pageX, Y: event.pageY };
  }

  mount() {
    for (var i = 0; i < this.pages.length; i++)
      this.ids[i] = this.pages[i].id;

    document.body.addEventListener("mousewheel", this.mousewheel, { passive: true });
    document.body.addEventListener("DOMMouseScroll", this.mousewheel, { passive: true });
    window.addEventListener('resize', e => this.resize());
    document.addEventListener('keydown', e => this.keydown(e));
    document.addEventListener('touchstart', this.ondown);
    document.addEventListener('touchmove', this.onmove);
    // document.addEventListener('touchleave', this.onup);
    document.addEventListener('touchcancel', this.onup);
    document.addEventListener('touchend', this.onup);

    document.addEventListener('mousedown', this.ondown);
    document.addEventListener('mousemove', this.onmove);
    document.addEventListener('mouseup', this.onup);

    document.body.style.overflow = 'hidden';
    this.windowHeight = window.innerHeight;

    this.resize();

    this.to(location.hash.replace('#', ''));
    this.autoScroll();
  }

  destroy() {
    document.body.removeEventListener("mousewheel", this.mousewheel);
    document.body.removeEventListener("DOMMouseScroll", this.mousewheel);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('touchstart', this.ondown);
    document.removeEventListener('touchmove', this.onmove);
    // document.removeEventListener('touchleave', this.onup);
    document.removeEventListener('touchcancel', this.onup);
    document.removeEventListener('touchend', this.onup);

    document.removeEventListener('mousedown', this.ondown);
    document.removeEventListener('mousemove', this.onmove);
    document.removeEventListener('mouseup', this.onup);
  }
}
