import StateController from './StateController';

export default class AnimationsControls {
    /**
     * Field animations controls class
     * @param data {Object}
     * * states {Array} allowed game states pull
     * * rowsNumber {Number} total rows
     * * colsNumber {Number} total columns
     * * moveDelay {Number} delay between fall render
     * * tetro_pull_length {Number} number of next symbols
     * * cell {Object} single cell config
     * @param configuration
     * * cells {Array }link to global table matrix
     * @constructor
     */
    constructor(data, configuration) {
        this.stateController = new StateController(data['states']);
        this.stateController.currentState = 'play';
        this.config = data;
        this._cells = configuration.cells;
        this._tetroPull = [];
        this.currentPositionX = 0;
        this.currentPositionY = 0;
        this.currentTime = 0;
        this._movingShape = null;
        this._moveDelay = data['moveDelay'];
        this.isGameOver = false;
        game._ticker.add(() => {
            this.tick()
        });
    }

////////////////////// RENDERING //////////////////////
    /**
     * Render method
     */
    tick() {
        this.currentTime++;
        switch (this.stateController.currentState) {
            case 'play' :
                this._renderPlay();
                break;
            case 'remove' :
                this._renderLineRemove();
                break;
        }
    }

    /**
     * Rendering moving down animation
     * @private
     */
    _renderPlay() {
        if (!this.movingTetromino) {
            this.movingTetromino = this.tetrominoFromPull;
            this.currentPositionX = (this.config['colsNumber'] / 2) -
                this.movingTetromino.localPositionX - Math.round(this.movingTetromino.width / 2);

            this.currentPositionY = 0;
            this.movingTetromino.blocks.forEach(block => {
                block.visible = true;
            });
            game.EventManager.dispatch('AnimationControls.ADD_TETROMINO');
        }

        if (this.isGameOver) {
            this.stateController.currentState = 'game_over';
            return;
        }

        const filledCells = this.movingTetromino.render(this.currentPositionX, this.currentPositionY, this.config['cell']);
        if (this.currentTime >= this.moveDelay) {
            const verticalMoveAllowed = this._canMoveVertically(this.currentPositionY + 1);
            if (verticalMoveAllowed) {
                this.currentPositionY++;
            } else {
                filledCells.forEach(({x, y}) => {
                    this._cells[y][x].addBlock(this.movingTetromino.getBlock());
                });
                this._checkForLineBurn();
                this.movingTetromino = null;
            }
            this.currentTime = 0;
        }
    }

    /**
     * Rendering line burning animation
     * @private
     */
    _renderLineRemove() {
        const linesToRemove = this._getLinesToRemove();

        linesToRemove.forEach(lineIndex => {
            this._cells[lineIndex].forEach(block => {
                block.clear();
            });
            let line = this._cells.splice(lineIndex, 1);
            this._cells.unshift(...line);
            this._cells.forEach((row, idX) => {
                if (idX <= lineIndex) {
                    row.forEach(cell => {
                        if (!cell.isEmpty) {
                            cell.moveDown();
                        }
                    })
                }
            });
            game.EventManager.dispatch('AnimationControls.UPDATE_SCORE');
        });

        this.stateController.currentState = 'play';
    }

////////////////////// CALCULATIONS //////////////////////
    /**
     * Check for state update
     * @private
     */
    _checkForLineBurn() {
        if (this._getLinesToRemove().length > 0) {
            this.stateController.currentState = 'remove';
            return true;
        }
        return false;
    }

    /**
     * Calculating lines to burn
     * @return {Array}
     * @private
     */
    _getLinesToRemove() {
        const linesToRemove = [];
        for (let rowId = 0; rowId < this._cells.length; rowId++) {
            let lineCanBeRemoved = true;
            for (let colId = 0; colId < this._cells[rowId].length; colId++) {
                if (this._cells[rowId][colId].isEmpty) {
                    lineCanBeRemoved = false;
                }
            }
            if (lineCanBeRemoved) {
                linesToRemove.push(rowId);
            }
        }
        return linesToRemove;
    }

    /**
     * Rotating tetramino
     */
    rotateTetromino() {
        if (!this.movingTetromino) {
            return;
        }
        let config = {
            posX: this.currentPositionX,
            posY: this.currentPositionY,
            cells: this._cells,
            totalCols: this.config['colsNumber'],
            totalRows: this.config['rowsNumber']
        };

        this.movingTetromino.rotate(config);
    }

    /**
     * Move current tetromino left
     */
    moveLeft() {
        if (!this.movingTetromino) {
            return;
        }
        if (this.currentPositionY + this.movingTetromino.height <= 3) {
            return;
        }
        this.currentPositionX = this._canMoveHorizontally(this.currentPositionX - 1) ?
            this.currentPositionX - 1 : this.currentPositionX;
    }

    /**
     * Move current tetromino right
     */
    moveRight() {
        if (!this.movingTetromino) {
            return;
        }
        if (this.currentPositionY + this.movingTetromino.height <= 3) {
            return;
        }
        this.currentPositionX = this._canMoveHorizontally(this.currentPositionX + 1) ?
            this.currentPositionX + 1 : this.currentPositionX;
    }

////////////////////// COLLISIONS //////////////////////
    /**
     * Vertical collision detection
     * @collision
     * @param y {Number}
     * @return {boolean}
     */
    _canMoveVertically(y) {
        for (let rowId = 0; rowId < this.movingTetromino.blocksData.length; rowId++) {
            for (let colId = 0; colId < this.movingTetromino.blocksData[rowId].length; colId++) {
                if (this.movingTetromino.blocksData[rowId][colId] === 0) continue;
                const blockX = this.currentPositionX + colId;
                const blockY = y + rowId;
                if (blockY >= this.config['rowsNumber']) {
                    return false;
                }
                if (!this._cells[blockY][blockX] || !this._cells[blockY][blockX].isEmpty) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Horizontal collision detection
     * @param x
     * @return {boolean}
     */
    _canMoveHorizontally(x) {
        for (let rowId = 0; rowId < this.movingTetromino.blocksData.length; rowId++) {
            for (let colId = 0; colId < this.movingTetromino.blocksData[rowId].length; colId++) {
                if (this.movingTetromino.blocksData[rowId][colId] === 0) continue;

                const blockX = x + colId;
                const blockY = this.currentPositionY + rowId;

                if (blockX < 0 || blockX >= this.config['colsNumber']) {
                    return false;
                }
                if (!this._cells[blockY][blockX] || !this._cells[blockY][blockX].isEmpty) {
                    return false;
                }

            }
        }
        return true;
    }

//////////////////////////////// GETTERS | SETTERS ////////////////////////////////
    get moveDelay() {
        return this._moveDelay;
    }

    set moveDelay(isForce) {
        this._moveDelay = isForce ? this.config['moveDelay'] / 30 : this.config['moveDelay'];
    }

    get tetrominoFromPull() {
        return this._tetroPull[0];
    }

    get movingTetromino() {
        return this._movingShape;
    }

    set movingTetromino(data) {
        this._movingShape = data;
    }

    get isEndRound() {
        this.isGameOver = this._checkEndRound();
        return this.isGameOver;
    }

    get tetrominos_pull() {
        return this._tetroPull;
    }

    set tetrominoToPull(new_tetromino) {
        this._tetroPull.push(new_tetromino);
        if (this._tetroPull.length > this.config.tetro_pull_length) {
            this._tetroPull.shift();
        }
    }

    /**
     * Checking for end of a game round
     * @return {boolean}
     * @private
     */
    _checkEndRound() {
        return (this.currentPositionY < 3 && !this._canMoveVertically(this.currentPositionY));
    }

    /**
     * Clearing and starting a new round
     */
    startNewRound() {
        this.isGameOver = false;
        this.currentTime = 0;
        this.movingTetromino = null;
        this.stateController.currentState = 'play';
    }
}