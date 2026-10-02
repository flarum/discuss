import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import formatNumber from 'flarum/common/utils/formatNumber';
import type Mithril from 'mithril';

export interface ICountUpAttrs extends ComponentAttrs {
  value: number;
  duration?: number;
}

/**
 * A number that counts up to its value on first render, so the stats read as live
 * rather than static. Skipped under `prefers-reduced-motion`.
 */
export default class CountUp extends Component<ICountUpAttrs> {
  private displayed: number = 0;
  private frame?: number;
  private animating: boolean = false;

  oninit(vnode: Mithril.Vnode<ICountUpAttrs, this>) {
    super.oninit(vnode);

    this.animating = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && this.attrs.value > 0;
  }

  oncreate(vnode: Mithril.VnodeDOM<ICountUpAttrs, this>) {
    super.oncreate(vnode);

    if (!this.animating) return;

    const target = this.attrs.value;
    const duration = this.attrs.duration ?? 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic: fast start, gentle landing.
      this.displayed = Math.round(target * (1 - Math.pow(1 - progress, 3)));

      // Writes the text node directly; a global m.redraw() per frame would re-render the whole page.
      vnode.dom.textContent = formatNumber(this.displayed);

      if (progress < 1) this.frame = requestAnimationFrame(tick);
      else this.animating = false;
    };

    this.frame = requestAnimationFrame(tick);
  }

  onremove(vnode: Mithril.VnodeDOM<ICountUpAttrs, this>) {
    super.onremove(vnode);

    if (this.frame) cancelAnimationFrame(this.frame);
  }

  view() {
    // Track later value changes (e.g. the online count refreshing) without re-animating.
    if (!this.animating) this.displayed = this.attrs.value;

    return <span className="CountUp">{formatNumber(this.displayed)}</span>;
  }
}
