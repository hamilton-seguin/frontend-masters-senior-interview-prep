import { useCallback } from 'react'

import flex from '@course/styles'
import css from './star-rating.module.css'
import cx from '@course/cx'

/**
 * Expected input:
 * {
 *   value: number,
 *   onChange: (value: number) => void,
 *   readonly?: boolean
 * }
 *
 * Steps to complete:
 * 1. Init constructor - define props type with value, onChange, readonly
 * 2. Provide template - render star buttons with proper attributes
 * 3. Handle click event - delegate click to update value
 * 4. Add ARIA attributes:
 *    Container:
 *    - role="radiogroup" — groups related radio-like controls so screen readers announce "radiogroup" when entering
 *    - aria-label="Star Rating" — provides an accessible name for the group (no visible label exists)
 *    - aria-readonly="true/false" — tells assistive tech whether the rating can be changed
 *    Each star button:
 *    - role="radio" — each star acts as a radio option within the group
 *    - aria-checked="true/false" — indicates which star is currently selected
 *    - aria-label="N Star(s)" — provides a meaningful label (e.g. "3 Stars") instead of just the emoji
 * 5. Add CSS styles for stars
 */

const EMOJIS = ['⭐️', '⭐️', '⭐️', '⭐️', '⭐️'] as const

type TStarRatingProps = {
  readonly?: boolean
  value: number
  onChange: (value: number) => void
}
export const StarRating = ({ readonly, value, onChange }: TStarRatingProps) => {
  const handleStarClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (readonly) return
      const button = (event.target as HTMLElement).closest('button')
      if (!button) return
      const starValue = Number(button.dataset.starValue)
      if (!Number.isNaN(starValue)) {
        onChange(starValue)
      }
    },
    [readonly, onChange],
  )

  return (
    <div
      className={cx(css.container, flex.wh100)}
      onClick={handleStarClick}
      role="radiogroup"
      aria-label="Star Rating"
      aria-readonly={readonly}
    >
      <input type="number" value={value} readOnly hidden />
      <div className={flex.flexRowCenter}>
        {EMOJIS.map((emoji, index) => {
          const starValue = index + 1
          return (
            <button
              aria-readonly={readonly}
              data-star-value={starValue}
              className={cx(css.star, flex.flexColumnCenter, flex.fontXL)}
              aria-label={`${starValue} Star${starValue === 1 ? '' : 's'}`}
              aria-checked={value === starValue}
              role="radio"
              type="button"
              key={index}
              data-active={value >= starValue}
              disabled={readonly}
            >
              <span>{emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
