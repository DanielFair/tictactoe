import React from 'react';

const Hud = (props) => {
    if(props.turn === 'selectMark'){
        return (
            <div className='hud'>
                Select your marker:<br/>
                <button className='selectMark' value={'X'} onClick={props.selectMarker}><b>X</b></button>
                &nbsp;or <button className='selectMark' value={'O'} onClick={props.selectMarker}><b>O</b></button>
            </div>
        )
    }
    else if(props.turn === 'selectDifficulty'){
        return (
            <div className='hud'>
                Select the opponent's difficulty:<br/>
                <button className='selectMark' value={'easy'} onClick={props.selectDifficulty}>Easy</button>
                &nbsp;or <button className='selectMark' value={'hard'} onClick={props.selectDifficulty}>Hard</button>
            </div>
        )
    }
    else {
        let message = '-';
        if(props.status === 'playerwon'){
            message = 'You won!';
        }
        else if(props.status === 'oppwon'){
            message = 'You lost!';
        }
        else if(props.status === 'tie'){
            message = 'Tie game!';
        }
        if(props.status === 'playerwon' || props.status === 'oppwon' || props.status === 'tie'){
            return (
                <div className='hud'>
                    <br/>
                    <span className='title'>{message}</span>
                </div>
            )
        }
        return (
            <div className='hud'>
                    <span className='title'>Score:</span><br/>
                    Player: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Computer:<br/>
                    <span className='score'><b>{props.playerWins}</b></span>&emsp;&emsp;&emsp;<button className='selectMark' onClick={props.resetBoard}>Reset Game</button>&emsp;&emsp;&emsp;<span className='score'><b>{props.oppWins}</b></span>
            </div>
        )
    }
}

export default Hud;
