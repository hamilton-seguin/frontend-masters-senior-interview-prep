import { AbstractComponent, type TComponentConfig } from '@course/utils'
import css from './tooltip.module.css'

type TPositionType = 'top' | 'bottom' | 'left' | 'right' | 'auto'

type TCandidate = { position: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number }

type TTooltipProps = {
  position?: TPositionType
  children: HTMLElement
  content: string
  boundary?: HTMLElement
}

const positions: Record<Exclude<TPositionType, 'auto'>, string> = {
  top: css.top,
  bottom: css.bottom,
  left: css.left,
  right: css.right,
} as const

let id = 0

/**
 * Helper: determine best position when position='auto'
 * - Get bounding rects for tooltip and container
 * - Check candidates (top, right, bottom, left) against boundary
 * - Return first position that fits, or 'top' as fallback
 */
function getAutoPosition(
  tooltip: HTMLElement,
  container: HTMLElement,
  boundaryElement: { left: number; top: number; right: number; bottom: number },
): Exclude<TPositionType, 'auto'> {
  const t = tooltip.getBoundingClientRect()
  const c = container.getBoundingClientRect()

  /**
   *                  ┌───TOP───┐
   *                  └─────────┘
   *     ┌──LEFT──┐   ┌─────────┐   ┌──RIGHT──┐
   *     └────────┘   │CONTAINER│   └─────────┘
   *                  └─────────┘
   *                  ┌──BOTTOM─┐
   *                  └─────────┘
   */
  const candidates: TCandidate[] = [
    { position: 'top', x: c.left, y: c.top - t.height },
    { position: 'right', x: c.right, y: c.top },
    { position: 'bottom', x: c.left, y: c.bottom },
    { position: 'left', x: c.left - t.width, y: c.top },
  ]

  /**
   * boundaryRect.left          boundaryRect.right
   *        ↓                          ↓
   *        ┌──────────────────────────┐  ← boundaryRect.top
   *        │                          │
   *        │                          │
   *        │      ┌──────────┐        │
   *        │      │  TOOLTIP │        │
   *        │      └──────────┘        │
   *        │                          │
   *        │                          │
   *        └──────────────────────────┘  ← boundaryRect.bottom
   */
  const fits = (x: number, y: number) =>
    x >= boundaryElement.left &&
    y >= boundaryElement.top &&
    Math.ceil(x + t.width) <= boundaryElement.right &&
    Math.ceil(y + t.height) <= boundaryElement.bottom

  return candidates.find(({ x, y }) => fits(x, y))?.position ?? 'top'
}

/**
 * Expected input:
 * {
 *   "children": HTMLElement (the trigger element),
 *   "content": "Tooltip text",
 *   "position": "top" | "bottom" | "left" | "right" | "auto",
 *   "boundary": HTMLElement (optional, for auto-positioning)
 * }
 *
 * Step 1: Extend AbstractComponent<TTooltipProps>
 * - Call super() with config, adding:
 *   - className: [css.container]
 *   - listeners: ['mouseenter', 'mouseleave', 'focusin', 'focusout', 'keydown']
 * - Store a unique id and a reference for the tooltip element
 */
export class Tooltip extends AbstractComponent<TTooltipProps> {
  id = id++
  tooltipElement: HTMLElement | null = null

  constructor(config: TComponentConfig<TTooltipProps>) {
    super({
      ...config,
      className: [css.container],
      listeners: ['mouseenter', 'mouseleave', 'focusin', 'focusout', 'keydown'],
    })
  }

  /**
   * Step 2: Implement toHTML
   * - Return a <div> with role="tooltip", unique id, display:none
   * - Apply css.tooltip class and position class from positions map
   * - Content comes from this.config.content
   * a11y: role="tooltip" on the tooltip element
   */
  toHTML(): string {
    const position = this.config.position ?? 'top'
    return `<div id="tooltip-${this.id}" style="display: none;" role="tooltip" class="${css.tooltip} ${positions[position as keyof typeof positions]}">${this.config.content}</div>`
  }

  /**
   * Step 3: Implement afterRender
   * - Append this.config.children (the trigger element) to this.container
   * - Query and store the tooltip element by its id
   * a11y: set aria-describedby on the trigger element pointing to the tooltip id
   */

  afterRender(): void {
    this.container!.appendChild(this.config.children)
    this.tooltipElement = this.container!.querySelector(`#tooltip-${this.id}`)
  }

  /**
   * Step 4: Implement event handlers
   * - onMouseenter / onFocusin: show the tooltip (call showTooltip)
   * - onMouseleave / onFocusout: hide the tooltip (set display to 'none')
   * - onKeydown: hide on Escape key
   * a11y: focusin/focusout ensure keyboard users can trigger tooltip; Escape dismisses it
   */

  onMouseenter() {
    this.showTooltip()
  }

  onMouseleave() {
    this.tooltipElement!.style.display = 'none'
  }

  onFocusin() {
    this.showTooltip()
  }

  onFocusout() {
    this.tooltipElement!.style.display = 'none'
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.tooltipElement!.style.display = 'none'
    }
  }

  /**
   * Step 5: Implement showTooltip
   * - Set tooltip display to 'block'
   * - If position is 'auto': compute best position using getAutoPosition,
   *   remove all position classes, add the computed one
   */
  showTooltip() {
    this.tooltipElement!.style.display = 'block'
    if (this.config.position === 'auto') {
      const boundaryRect = this.config.boundary
        ? this.config.boundary.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }

      const position =
        positions[getAutoPosition(this.tooltipElement!, this.container!, boundaryRect)]
      for (const classname of Object.values(positions)) {
        this.tooltipElement!.classList.remove(classname)
      }
      this.tooltipElement!.classList.add(position)
    }
  }
}
