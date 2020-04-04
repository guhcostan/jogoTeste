export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = 'black'
    context.clearRect(0, 0, 50000, 50000)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = player.color
        context.fillRect(player.x-10, player.y-10, 20, 20)
    }

    for (let pointId in game.state.points) {
        const point = game.state.points[pointId]
        context.fillStyle = point.color
        context.fillRect(point.x-10, point.y-10, 20, 20)
    }
    const currentPlayer = game.state.players[currentPlayerId]

    if(currentPlayer) {
        context.fillStyle = currentPlayer.color
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}
