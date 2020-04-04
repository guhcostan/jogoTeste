export default function createMouseListener(document) {
    const state = {
        observers: [],
        click: false
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('mousedown', handleKeyDown)

    function handleKeyUp() {
        state.click = false
    }

    document.addEventListener('mouseup', handleKeyUp)
    document.addEventListener('mousemove', handleMove)

    function handleKeyDown() {
        state.click = true
    }

    function handleMove(event) {
        if (state.click) {
            const command = {
                playerId: state.playerId,
                x: event.x,
                y: event.y
            }

            notifyAll(command)
        }
    }

    return {
        subscribe
    }
}