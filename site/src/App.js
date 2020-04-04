import React, {useEffect, useState} from 'react';
import './App.css';
import createGame from './utils/game.js'
import createMouseListener from './utils/mouseListiner'
import renderScreen from './utils/render-screen.js'
import io from 'socket.io-client';
import {SketchPicker} from 'react-color';

const canvas = document.getElementById('screen')

const socket = io('localhost:3333')
let game = createGame()
const mouseListener = createMouseListener(document, canvas, socket)


function App() {

    const [witdh, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [color, setColor] = useState('red')

    function updateWindowDimensions() {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    startGame()

    setInterval(() => {
        sync(game.state)
    }, 200)

    useEffect(() => {
        updateWindowDimensions()
        window.addEventListener('resize', updateWindowDimensions);
        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        }
    }, [])

    function sync(db){
        socket.emit('sync', db)
    }

    function startGame() {

        socket.on('connect', () => {
            const playerId = socket.id

            const screen = document.getElementById('screen')
            renderScreen(screen, game, requestAnimationFrame, playerId)
        })

        socket.on('setup', (state) => {
            game.setState(state)
        })

        mouseListener.subscribe((command) =>
            addPoint(command)
        )

        socket.on('sync', (state) => {
            game.setState(state)
        })
    }

    function addPoint(command) {
        command.color = color
        game.state.points[command.x + '-' + command.y] = command

    }

    return (
        <div className="App">
            <div style={{position: "absolute"}}>
                <canvas id={'screen'} width={witdh} height={height} style={{width: witdh, height: height}}/>
            </div>
            <div id={'ui'}>
                <SketchPicker color={color} onChangeComplete={({hex}) => setColor(hex)}/>
            </div>
        </div>
    );
}

export default App;
