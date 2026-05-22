import React, { useState, useEffect, useId, useRef } from 'react'
import css from './tooltip.module.css'
import cx from '@course/cx'

type TooltipProps = {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  children: React.ReactNode
  content: React.ReactNode
  boundary?: React.RefObject<HTMLElement | null> | HTMLElement
}

const positions = {
  top: css.top,
  bottom: css.bottom,
  left: css.left,
  right: css.right,
} as const

type TCandidate = { position: 'top' | 'bottom' | 'left' | 'right'; x: number; y: number }

/**
 * Helper: determine best position when position='auto'
 * - Get bounding rects for tooltip and trigger
 * - Check candidates (top, right, bottom, left) against boundary
 * - Return first position that fits, or 'top' as fallback
 */
const getAutoPosition = (
  tooltipRect: DOMRect,
  triggerRect: DOMRect,
  boundaryRect: { left: number; top: number; right: number; bottom: number },
): 'top' | 'bottom' | 'left' | 'right' => {
  const { width: tw, height: th } = tooltipRect
  const { left: trL, top: trT, width: trW, height: trH, right: trR, bottom: trB } = triggerRect

  const fits = (x: number, y: number) =>
    x >= boundaryRect.left &&
    y >= boundaryRect.top &&
    Math.ceil(x + tw) <= boundaryRect.right &&
    Math.ceil(y + th) <= boundaryRect.bottom

  const candidates: TCandidate[] = [
    { position: 'top', x: trL, y: trT - th },
    { position: 'right', x: trR, y: trT },
    { position: 'bottom', x: trL, y: trB },
    { position: 'left', x: trL - tw, y: trT },
  ]

  return candidates.find(({ x, y }) => fits(x, y))?.position ?? 'top'
}

/**
 * Expected input:
 * <Tooltip position="top" content="Tooltip text">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * Optional: position="auto" with boundary={ref} for auto-positioning
 *
 * Step 1: Implement Tooltip component
 * - Track isVisible with useState (default: false)
 * - Track tooltipPosition with useState (default: position or 'top')
 * - Create refs for tooltip element and container element
 * - Use useEffect to compute auto-position when visible and position='auto'
 * - Generate unique id with useId() for aria-describedby
 * - Implement show/hide handlers for mouse enter/leave, focus/blur
 * - Handle Escape key to hide tooltip
 * - Render:
 *   - Container div with mouse/focus/keyboard handlers and css.container
 *   - Children inside the container
 *   - When visible: tooltip div with role="tooltip", id, ref, and position class
 *   - Use aria-describedby on container pointing to tooltip id when visible
 */
export function Tooltip({ children, content, position = 'top', boundary }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(
    position === 'auto' ? 'top' : position,
  )

  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && position === 'auto' && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const triggerRect = containerRef.current.getBoundingClientRect()

      const boundaryElement = boundary instanceof HTMLElement ? boundary : boundary?.current
      const boundaryRect = boundaryElement
        ? boundaryElement.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }

      const newPosition = getAutoPosition(tooltipRect, triggerRect, boundaryRect)

      if (newPosition !== tooltipPosition) {
        setTooltipPosition(newPosition)
      }
    }
  }, [isVisible, position, tooltipPosition, boundary])

  const id = useId()
  const show = () => setIsVisible(true)
  const hide = () => {
    setIsVisible(false)
    if (position === 'auto') setTooltipPosition('top')
  }
  const handleEsc = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') hide()
  }

  return (
    <div
      ref={containerRef}
      className={cx(css.container)}
      onFocus={show}
      onBlur={hide}
      onMouseEnter={show}
      onMouseLeave={hide}
      onKeyDown={handleEsc}
      aria-describedby={isVisible ? id : undefined}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          id={id}
          className={cx(css.tooltip, positions[tooltipPosition])}
        >
          {content}
        </div>
      )}
    </div>
  )
}
