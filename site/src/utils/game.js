export default function createGame() {
    const state = {
        players: [],
        points: {},
    }

    function start() {

    }

    function setState(newState) {
        state.players = newState.players
        state.points = newState.points
    }

    return {
        state,
        setState,
        start
    }
}
