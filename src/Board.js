import React from 'react';
import Hud from './Hud';

class Board extends React.Component {
    constructor(props){
        super(props);
        let boardArr = [];
        for(var x = 0; x < 9; x++){
            boardArr.push({
                contents: '',
                tile: x
            });
        }
        this.state = {
            turn: 'selectMark',
            playerMark: '',
            oppMark: '',
            board: boardArr,
            difficulty: 'hard',
            playerWins: 0,
            oppWins: 0,
            status: ''
        };
    }
    componentDidUpdate = () => {
        const checkReset = () => {
            if(this.state.status === 'playerwon' || this.state.status === 'oppwon' || this.state.status === 'tie'){
                this.resetBoard(true);
            }
        }
        setTimeout(checkReset, 3000);

    }
    resetBoard = (nextgame) => {
        let boardArr = [];
        for(var x = 0; x < 9; x++){
            boardArr.push({
                contents: '',
                tile: x
            });
        }
        if(nextgame !== true){
            this.setState({
                board: boardArr,
                status: '',
                turn: 'selectMark',
                playerWins: 0,
                oppWins: 0
            });
        }
        else{
            this.setState({
                board: boardArr,
                status: '',
            });
        }
    }
    selectMarker = (e) => {
        let oppMark = (e.currentTarget.value === 'X' ? 'O' : 'X');
        this.setState({
            turn: 'selectDifficulty',
            playerMark: e.currentTarget.value,
            oppMark: oppMark
        });
    }
    selectDifficulty = (e) => {
        this.setState({
            difficulty: e.currentTarget.value,
            turn: 'player'
        });
    }
    handlePlayerTurn = (e) => {
        let status = ''; 
        if(this.state.board[e.currentTarget.id].contents === ''){
            let targetKey = e.currentTarget.id;
            let updatedBoard = [...this.state.board];
            updatedBoard[targetKey].contents = this.state.playerMark;
            if(this.checkWin(updatedBoard) === 'playerwon'){
                status='playerwon';
                this.setState({
                    board: updatedBoard,
                    status: status,
                    playerWins: this.state.playerWins+1
                })
                return;
            }
            else if(this.checkWin(updatedBoard) === 'tie'){
                status='tie';
                this.setState({
                    status: status
                })
                return;
            }
            this.opponentTurn(updatedBoard);
            if(this.checkWin(updatedBoard) === 'oppwon'){
                status='oppwon';
                this.setState({
                    board: updatedBoard,
                    status: status,
                    oppWins: this.state.oppWins+1
                })
                return;
            }
            else if(this.checkWin(updatedBoard) === 'tie'){
                status='tie';
                this.setState({
                    status: status
                })
                return;
            }

            this.setState({
                board: updatedBoard,
            });
        }
    }
    opponentTurn = (board) => {
        //Implement opponents AI, priority based moves for hard mode
        let moved = false;
        while(!moved){
            if(this.state.difficulty === 'hard'){
                let checkMoves = this.checkWin(board);
                if(checkMoves === 'tie' || checkMoves === 'playerwon' || checkMoves === 'oppwon'){return;};
                // 	1. Go for the win if the computer has two in a row
                for(var x = 0; x < checkMoves.length; x++){
                    if(checkMoves[x].streak === 'opp'){
                        let targetTile = checkMoves[x].missing;
                        board[targetTile].contents = this.state.oppMark;
                        moved = true;
                        return;
                    }
                }
                // checkMoves.forEach((comboObj) => {
                //     if(comboObj.streak === 'opp'){
                //         let targetTile = comboObj.missing;
                //         board[targetTile].contents = this.state.oppMark;
                //         moved = true;
                //         return;
                //     }
                // })
                // if(moved){
                //     return;
                // }

                // 	2. Block the player from winning if player has two in a row
                for(var y = 0; y < checkMoves.length; y++){
                    if(checkMoves[y].streak === 'player'){
                        let targetTile = checkMoves[y].missing;
                        board[targetTile].contents = this.state.oppMark;
                        moved = true;
                        return;
                    }
                }
                // checkMoves.forEach((comboObj) => {
                //     if(comboObj.streak === 'player' && !moved){
                //         let targetTile = comboObj.missing;
                //         board[targetTile].contents = this.state.oppMark;
                //         moved = true;
                //         return;
                //     }
                // })
                // if(moved){
                //     return;
                // }
                // 	3. If possible, create two threats to win and play the fork:
                let checkFork = this.checkWin(board, true);
                for(var a = 0; a < checkFork.length; a++){
                    if(checkFork[a].streak === 'opp'){
                        let targetTile = checkFork[a].missing;
                        board[targetTile].contents = this.state.oppMark;
                        moved = true;
                        return;
                    }
                }
                // checkFork.forEach((comboObj) => {
                //     if(comboObj.streak === 'opp'){
                //         let targetTile = comboObj.missing;
                //         board[targetTile].contents = this.state.oppMark;
                //         moved = true;
                        
                //     }
                // })
                // if(moved){
                //     return;
                // }
                // 	4. If the player can fork, the computer will move to block it
                for(var b = 0; b < checkFork.length; b++){
                    if(checkFork[b].streak === 'player'){
                        let targetTile = checkFork[b].missing;
                        board[targetTile].contents = this.state.oppMark;
                        moved = true;
                        return;
                    }
                }
                // checkFork.forEach((comboObj) => {
                //     if(comboObj.streak === 'player'){
                //         let targetTile = comboObj.missing;
                //         board[targetTile].contents = this.state.oppMark;
                //         moved = true;
                //     }
                // })
                // if(moved){
                //     return;
                // }
                // 	5. Next priority is the center tile
                if(board[4].contents === ''){
                    board[4].contents = this.state.oppMark;
                    moved = true;
                }
                // 	6. If the player is in a corner, play the empty opposite corner
                else if(board[0].contents === this.state.playerMark && board[8].contents === ''){
                    board[8].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[2].contents === this.state.playerMark && board[6].contents === ''){
                    board[6].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[6].contents === this.state.playerMark && board[2].contents === ''){
                    board[2].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[8].contents === this.state.playerMark && board[0].contents === ''){
                    board[0].contents = this.state.oppMark;
                    moved = true;
                }
                // 	7. If there's an empty corner tile, the computer will play it
                else if(board[0].contents === ''){
                    board[0].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[2].contents === ''){
                    board[2].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[6].contents === ''){
                    board[6].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[8].contents === ''){
                    board[8].contents = this.state.oppMark;
                    moved = true;
                }
                // 	8. Last priority is to play one of the side-middle squares
                else if(board[1].contents === ''){
                    board[1].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[3].contents === ''){
                    board[3].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[5].contents === ''){
                    board[5].contents = this.state.oppMark;
                    moved = true;
                }
                else if(board[7].contents === ''){
                    board[7].contents = this.state.oppMark;
                    moved = true;
                }
                else{
                    moved=true;
                }
            }
            //Easy mode: Enemy will move randomly to any open square
            else if (this.state.difficulty === 'easy'){
                let openTiles = [];
                board.forEach((tile, i) => {
                    if(tile.contents === ''){
                        openTiles.push(i);
                    }
                });
                if(openTiles.length > 0){
                    let randomIndex = Math.floor(Math.random() * (openTiles.length-1));
                    let randomTile = openTiles[randomIndex];
                    if(board[randomTile].contents === ''){
                        board[randomTile].contents = this.state.oppMark;
                        moved = true;
                    }
                }         
                else{
                    moved=true;
                }   
            }
        }
    }

    checkWin = (board, fork) => {
        let combos;
        let winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        let forkCombos = [[0,1,3], [1,2,5], [3,6,7], [5,7,8]];
        if(fork === undefined){
            combos = winCombos;
        }
        else if(fork === true){
            combos = forkCombos;
        }
        let boardResults = [];
        combos.forEach((combo) => {
            let obj = {};
            obj.combo = combo;
            obj.streak = '';
            obj.missing = '';
            boardResults.push(obj);
        });

        boardResults.forEach((comboObj) => {
            let playerCount = 0;
            let playerStreak = [];
            let oppCount = 0;
            let oppStreak = [];

            comboObj.combo.forEach((index) => {
                if(board[index].contents === this.state.playerMark){
                    playerCount++;
                    playerStreak.push(index);
                }
                else if(board[index].contents === this.state.oppMark){
                    oppCount++;
                    oppStreak.push(index);
                }
            });
            if(playerCount === 3 && !fork){
                comboObj.streak = 'playerwon';
            }
            else if(oppCount === 3 && !fork){
                comboObj.streak = 'oppwon';
            }
            else if(playerCount === 2){
                comboObj.combo.forEach((index) => {
                    let matched = false;
                    playerStreak.forEach((i) => {
                        if(i === index){
                            matched = true;
                        }
                    });
                    if(matched === false && board[index].contents === ''){
                        let missing = index;
                        comboObj.streak = 'player';
                        comboObj.missing = missing;
                    }
                });
            }
            else if(oppCount === 2){
                comboObj.combo.forEach((index) => {
                    let matched = false;
                    oppStreak.forEach((i) => {
                        if(i === index){
                            matched = true;
                        }
                    });
                    if(matched === false && board[index].contents === ''){
                        let missing = index;
                        comboObj.streak = 'opp';
                        comboObj.missing = missing;
                    }
                });
            }
        });
        
        //Check if there's any streak playerwin or oppwin in boardResults, and return a string if there is
        boardResults.forEach((comboObj) => {
            if(comboObj.streak === 'playerwon'){
                boardResults = 'playerwon';
            }
            else if(comboObj.streak === 'oppwon'){
                boardResults = 'oppwon';
            }
        });
        //Check if all tiles have been played, and return a tie
        let tilesRemain = false;
        
        board.forEach((tile) => {
            if(tile.contents === ''){
                tilesRemain = true;
            }
        })

        if(!tilesRemain && boardResults !== 'oppwon' && boardResults !== 'playerwon' && !fork){
            boardResults = 'tie';
        }
        return boardResults;
    }
    render() {
        let tileArr;
        if(this.state.turn === 'player'){
            tileArr = this.state.board.map((tile, i) => {
                return <Tile contents={tile.contents} key={i} id={i} turn={this.state.turn} onClick={this.handlePlayerTurn} />;
            })
        }
        else{
            tileArr = null;
        }
        return (
            <div>
                <Hud
                    turn={this.state.turn} 
                    selectMarker={this.selectMarker}
                    selectDifficulty={this.selectDifficulty} 
                    resetBoard={this.resetBoard} 
                    playerWins={this.state.playerWins}
                    oppWins={this.state.oppWins}
                    status={this.state.status} />
                <div className='board'>
                    {tileArr}
                </div>
            </div>            
        )
    }
}
const Tile = (props) => {
    return (
        <div className='tile' onClick={props.onClick} id={props.id}>
            <div className='tileContents'>
                {props.contents}
            </div>
        </div>
    );
}

export default Board;