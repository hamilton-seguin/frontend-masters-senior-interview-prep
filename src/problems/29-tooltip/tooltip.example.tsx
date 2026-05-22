import { Tooltip } from './solution/tooltip.react'
import { Tooltip as TooltipStudent } from './tooltip.react'
import { Tooltip as VanillaTooltip } from './solution/tooltip.vanila'
import { Tooltip as VanillaTooltipStudent } from './tooltip.vanila'
import { useEffect, useRef } from 'react'
import flex from '@course/styles'
import cx from '@course/cx'

export function TooltipExample() {
  const autoBoundaryRef = useRef<HTMLDivElement>(null)
  return (
    <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingHor32)}>
      <h3>Auto-Positioning</h3>
      <p style={{ color: '#888', margin: 0 }}>
        Buttons at container edges force auto to pick a different direction
      </p>
      <div
        ref={autoBoundaryRef}
        className={flex.h300px}
        style={{
          position: 'relative',
          width: '100%',
          border: '1px dashed #555',
          borderRadius: '8px',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
          <Tooltip position="auto" boundary={autoBoundaryRef} content="No room above → goes bottom">
            <button>Top Edge</button>
          </Tooltip>
        </div>
        <div
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        >
          <Tooltip position="auto" boundary={autoBoundaryRef} content="No room below → goes top">
            <button>Bottom Edge</button>
          </Tooltip>
        </div>
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <Tooltip
            position="auto"
            boundary={autoBoundaryRef}
            content="No room left → goes top or right"
          >
            <button>Left Edge</button>
          </Tooltip>
        </div>
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <Tooltip
            position="auto"
            boundary={autoBoundaryRef}
            content="No room right → goes top or left"
          >
            <button>Right Edge</button>
          </Tooltip>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Tooltip
            position="auto"
            boundary={autoBoundaryRef}
            content="Room everywhere → defaults to top"
          >
            <button>Center</button>
          </Tooltip>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Fixed Positions</h3>
      <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
        <Tooltip position="top" content="I appear above the button">
          <button>⬆️ Top</button>
        </Tooltip>
        <Tooltip position="bottom" content="I appear below the button">
          <button>⬇️ Bottom</button>
        </Tooltip>
        <Tooltip position="left" content="I appear to the left">
          <button>⬅️ Left</button>
        </Tooltip>
        <Tooltip position="right" content="I appear to the right">
          <button>➡️ Right</button>
        </Tooltip>
      </div>
    </div>
  )
}

export function TooltipVanillaExample() {
  const fixedRef = useRef<HTMLDivElement>(null)
  const autoBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fixedRef.current || !autoBoxRef.current) return

    const createTooltip = (
      root: HTMLElement,
      text: string,
      position: 'top' | 'bottom' | 'left' | 'right' | 'auto',
      btnText: string,
      boundary?: HTMLElement,
    ) => {
      const btn = document.createElement('button')
      btn.textContent = btnText
      const tooltip = new VanillaTooltipStudent({ root, children: btn, content: text, position, boundary })
      tooltip.render()
      return tooltip
    }

    // Fixed positions row
    const tooltips = [
      createTooltip(fixedRef.current, 'I appear above the button', 'top', '⬆️ Top'),
      createTooltip(fixedRef.current, 'I appear below the button', 'bottom', '⬇️ Bottom'),
      createTooltip(fixedRef.current, 'I appear to the left', 'left', '⬅️ Left'),
      createTooltip(fixedRef.current, 'I appear to the right', 'right', '➡️ Right'),
    ]

    // Auto-positioning — create wrapper divs at edges
    const box = autoBoxRef.current
    const autoConfigs: { text: string; btnText: string; style: string }[] = [
      {
        text: 'No room above → goes bottom',
        btnText: 'Top Edge',
        style: 'position:absolute;top:0;left:50%;transform:translateX(-50%)',
      },
      {
        text: 'No room below → goes top',
        btnText: 'Bottom Edge',
        style: 'position:absolute;bottom:0;left:50%;transform:translateX(-50%)',
      },
      {
        text: 'No room left → goes top or right',
        btnText: 'Left Edge',
        style: 'position:absolute;left:0;top:50%;transform:translateY(-50%)',
      },
      {
        text: 'No room right → goes top or left',
        btnText: 'Right Edge',
        style: 'position:absolute;right:0;top:50%;transform:translateY(-50%)',
      },
      {
        text: 'Room everywhere → defaults to top',
        btnText: 'Center',
        style: 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)',
      },
    ]

    const autoTooltips = autoConfigs.map(({ text, btnText, style }) => {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('style', style)
      box.appendChild(wrapper)
      return createTooltip(wrapper, text, 'auto', btnText, box)
    })

    return () => {
      tooltips.forEach((t) => t?.destroy())
      autoTooltips.forEach((t) => t?.destroy())
    }
  }, [])

  return (
    <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingHor32)}>
      <h3>Auto-Positioning</h3>
      <p style={{ color: '#888', margin: 0 }}>
        Buttons at container edges force auto to pick a different direction
      </p>
      <div
        ref={autoBoxRef}
        className={flex.h300px}
        style={{
          position: 'relative',
          width: '100%',
          border: '1px dashed #555',
          borderRadius: '8px',
        }}
      />

      <h3 style={{ marginTop: '2rem' }}>Fixed Positions</h3>
      <div ref={fixedRef} className={cx(flex.flexRowCenter, flex.flexGap32)} />
    </div>
  )
}
export function TooltipStudentExample() {
  const autoBoundaryRef = useRef<HTMLDivElement>(null)
  return (
    <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingHor32)}>
      <h3>Auto-Positioning</h3>
      <p style={{ color: '#888', margin: 0 }}>
        Buttons at container edges force auto to pick a different direction
      </p>
      <div
        ref={autoBoundaryRef}
        className={flex.h300px}
        style={{
          position: 'relative',
          width: '100%',
          border: '1px dashed #555',
          borderRadius: '8px',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
          <TooltipStudent
            position="auto"
            content="No room above → goes bottom"
          >
            <button>Top Edge</button>
          </TooltipStudent>
        </div>
        <div
          style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
        >
          <TooltipStudent
            position="auto"
            content="No room below → goes top"
          >
            <button>Bottom Edge</button>
          </TooltipStudent>
        </div>
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <TooltipStudent
            position="auto"
            content="No room left → goes top or right"
          >
            <button>Left Edge</button>
          </TooltipStudent>
        </div>
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <TooltipStudent
            position="auto"
            content="No room right → goes top or left"
          >
            <button>Right Edge</button>
          </TooltipStudent>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <TooltipStudent
            position="auto"
            content="Room everywhere → defaults to top"
          >
            <button>Center</button>
          </TooltipStudent>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Fixed Positions</h3>
      <div className={cx(flex.flexRowCenter, flex.flexGap32)}>
        <TooltipStudent position="top" content="I appear above the button">
          <button>⬆️ Top</button>
        </TooltipStudent>
        <TooltipStudent position="bottom" content="I appear below the button">
          <button>⬇️ Bottom</button>
        </TooltipStudent>
        <TooltipStudent position="left" content="I appear to the left">
          <button>⬅️ Left</button>
        </TooltipStudent>
        <TooltipStudent position="right" content="I appear to the right">
          <button>➡️ Right</button>
        </TooltipStudent>
      </div>
    </div>
  )
}

export function TooltipStudentVanillaExample() {
  const fixedRef = useRef<HTMLDivElement>(null)
  const autoBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fixedRef.current || !autoBoxRef.current) return

    const createTooltip = (
      root: HTMLElement,
      text: string,
      position: 'top' | 'bottom' | 'left' | 'right' | 'auto',
      btnText: string,
      boundary?: HTMLElement,
    ) => {
      const btn = document.createElement('button')
      btn.textContent = btnText
      const tooltip = new VanillaTooltipStudent({
        root,
        children: btn,
        content: text,
        position,
        boundary,
      })
      tooltip.render()
      return tooltip
    }

    // Fixed positions row
    const tooltips = [
      createTooltip(fixedRef.current, 'I appear above the button', 'top', '⬆️ Top'),
      createTooltip(fixedRef.current, 'I appear below the button', 'bottom', '⬇️ Bottom'),
      createTooltip(fixedRef.current, 'I appear to the left', 'left', '⬅️ Left'),
      createTooltip(fixedRef.current, 'I appear to the right', 'right', '➡️ Right'),
    ]

    // Auto-positioning — create wrapper divs at edges
    const box = autoBoxRef.current
    const autoConfigs: { text: string; btnText: string; style: string }[] = [
      {
        text: 'No room above → goes bottom',
        btnText: 'Top Edge',
        style: 'position:absolute;top:0;left:50%;transform:translateX(-50%)',
      },
      {
        text: 'No room below → goes top',
        btnText: 'Bottom Edge',
        style: 'position:absolute;bottom:0;left:50%;transform:translateX(-50%)',
      },
      {
        text: 'No room left → goes top or right',
        btnText: 'Left Edge',
        style: 'position:absolute;left:0;top:50%;transform:translateY(-50%)',
      },
      {
        text: 'No room right → goes top or left',
        btnText: 'Right Edge',
        style: 'position:absolute;right:0;top:50%;transform:translateY(-50%)',
      },
      {
        text: 'Room everywhere → defaults to top',
        btnText: 'Center',
        style: 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)',
      },
    ]

    const autoTooltips = autoConfigs.map(({ text, btnText, style }) => {
      const wrapper = document.createElement('div')
      wrapper.setAttribute('style', style)
      box.appendChild(wrapper)
      return createTooltip(wrapper, text, 'auto', btnText, box)
    })

    return () => {
      tooltips.forEach((t) => t?.destroy())
      autoTooltips.forEach((t) => t?.destroy())
    }
  }, [])

  return (
    <div className={cx(flex.flexColumnCenter, flex.flexGap24, flex.paddingHor32)}>
      <h3>Auto-Positioning</h3>
      <p style={{ color: '#888', margin: 0 }}>
        Buttons at container edges force auto to pick a different direction
      </p>
      <div
        ref={autoBoxRef}
        className={flex.h300px}
        style={{
          position: 'relative',
          width: '100%',
          border: '1px dashed #555',
          borderRadius: '8px',
        }}
      />

      <h3 style={{ marginTop: '2rem' }}>Fixed Positions</h3>
      <div ref={fixedRef} className={cx(flex.flexRowCenter, flex.flexGap32)} />
    </div>
  )
}
