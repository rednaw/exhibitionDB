import interact from "interactjs"

let canvas
let element
const mouse = {
  x: 0,
  y: 0,
  startX: 0,
  startY: 0
}

export const init = el => {
  interact(el)
    .draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.createSnapGrid({
              x: 20,
              y: 20
            })
          ],
          range: Infinity,
          relativePoints: [{
            x: 0,
            y: 0
          }]
        }),
        interact.modifiers.restrict({
          restriction: el.parentNode,
          elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
          },
          endOnly: true
        })
      ],
      inertia: true
    })
    .on("dragmove", event => {
      const items = document.getElementsByClassName("selected")
      const { dx, dy } = event

      const parseDataAxis = target => axis =>
        parseFloat(target.getAttribute(`data-${axis}`))

      const translate = target => (x, y) => {
        target.style.webkitTransform = "translate(" + x + "px, " + y + "px)"
        target.style.transform = "translate(" + x + "px, " + y + "px)"
      }

      const updateAttributes = target => (x, y) => {
        target.setAttribute("data-x", x)
        target.setAttribute("data-y", y)
      }

      if (items.length > 0) {
        for (const item of items) {
          const x = parseDataAxis(item)("x") + dx
          const y = parseDataAxis(item)("y") + dy

          translate(item)(x, y)
          updateAttributes(item)(x, y)
        }
      } else {
        const { target } = event
        const x = (parseDataAxis(target)("x") || 0) + dx
        const y = (parseDataAxis(target)("y") || 0) + dy

        translate(target)(x, y)
        updateAttributes(target)(x, y)
      }
    })
}

export function mouseDown(e) {
  if (e.target.id === 'container') {
    const rects = [...canvas.querySelectorAll('.selection')]

    if (rects) {
      for (const rect of rects) {
        canvas.removeChild(rect)
      }
    }

    mouse.startX = mouse.x
    mouse.startY = mouse.y
    element = document.createElement('div')
    element.className = 'selection'
    element.style.border = '1px dashed black'
    element.style.position = 'absolute'
    element.style.left = mouse.x + 'px'
    element.style.top = mouse.y + 'px'
    canvas.appendChild(element)
  }
}

export function mouseMove(e) {
  setMousePosition(e)
  if (element) {
    element.style.width = Math.abs(mouse.x - mouse.startX) + 'px'
    element.style.height = Math.abs(mouse.y - mouse.startY) + 'px'
    element.style.left =
      mouse.x - mouse.startX < 0 ? mouse.x + 'px' : mouse.startX + 'px'
    element.style.top =
      mouse.y - mouse.startY < 0 ? mouse.y + 'px' : mouse.startY + 'px'
  }
}

export function mouseUp() {
  element = null

  if (canvas) {
    const rect = canvas.querySelector('.selection')
    const boxes = [...canvas.querySelectorAll('.item')]

    if (rect) {
      const inBounds = []

      for (const box of boxes) {
        if (isInBounds(rect, box)) {
          inBounds.push(box)
        } else {
          box.style.boxShadow = 'none'
          box.classList.remove('selected')
        }
      }

      if (inBounds.length >= 2) {
        for (const box of inBounds) {
          box.style.boxShadow = '0 0 3pt 3pt hsl(141, 53%, 53%)'
          box.classList.add('selected')
        }
      }

      if (rect) canvas.removeChild(canvas.querySelector('.selection'))
    }
  }
}

function setMousePosition(e) {
  const ev = e || window.event

  if (ev.pageX) {
    mouse.x = ev.pageX + window.pageXOffset
    mouse.y = ev.pageY + window.pageYOffset
  } else if (ev.clientX) {
    mouse.x = ev.clientX + document.body.scrollLeft
    mouse.y = ev.clientY + document.body.scrollTop
  }
}

function isInBounds(obj1, obj2) {
  const a = obj1.getBoundingClientRect()
  const b = obj2.getBoundingClientRect()

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}
