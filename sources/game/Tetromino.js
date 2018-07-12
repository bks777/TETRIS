export default class Tetromino {
    /**
     * @constructor
     * @param respack {Object} resources pack
     * @param parent {PIXI.DisplayObject}
     * @param configuration {Object}
     * * mtrx {Array} Tetromino matrix array
     * * color {String} color of a tetramino
     */
    constructor(respack, parent, configuration) {
        this.type = null;
        this.config = configuration;
        this.blocksData = configuration['mtrx'];
        this.blocks = [];
        this.container = parent;
        this._initElements(respack);
    }

    /**
     * Creating a PIXI.DisplayObject from a matrix array
     * @private
     */
    _initElements(respack) {
        let tempPart;

        for (let rowId = 0; rowId < this.blocksData.length; rowId++) {
            for (let colId = 0; colId < this.blocksData[rowId].length; colId++) {
                if (this.blocksData[rowId][colId] > 0) {
                    tempPart = new PIXI.Sprite(respack[`block_${this.config.color}`]);
                    tempPart.visible = false;
                    this.blocks.push(this.container.addChild(tempPart));
                }
            }
        }
    }

    /**
     * returns blocks data
     * @return {*}
     */
    getBlock() {
        return this.blocks.shift();
    }

    /**
     * Calculating new matrix for a current tetromino
     * @param config
     */
    rotate(config) {
        let {posX, posY, cells, totalCols, totalRows} = config;
        if (posY + this.height <= 3) {
            return;
        }

        let mtrx = [];
        for (let rowId = 0; rowId < this.blocksData.length; rowId++) {
            mtrx[rowId] = [];
            for (let colId = 0; colId < this.blocksData[rowId].length; colId++) {
                mtrx[rowId][colId] = this.blocksData[rowId][colId];
            }
        }

        let N = mtrx.length;
        for (let x = 0; x < N / 2; x++) {
            for (let y = x; y < N - x - 1; y++) {
                let temp = mtrx[x][y];
                mtrx[x][y] = mtrx[y][N - 1 - x];
                mtrx[y][N - 1 - x] = mtrx[N - 1 - x][N - 1 - y];
                mtrx[N - 1 - x][N - 1 - y] = mtrx[N - 1 - y][x];
                mtrx[N - 1 - y][x] = temp;
            }
        }

        if (Tetromino._canRotate(posX, posY, cells, totalCols, totalRows, mtrx)) {
            this.blocksData = mtrx;
        }
    }

    /**
     * Borders collisions detection
     * @param posX
     * @param posY
     * @param cells
     * @param matrix
     * @param totalCols
     * @param totalRows
     * @return {boolean}
     * @static
     * @private
     */
    static _canRotate(posX, posY, cells, totalCols, totalRows, matrix) {
        for (let rowId = 0; rowId < matrix.length; rowId++) {
            for (let colId = 0; colId < matrix[rowId].length; colId++) {
                if (matrix[rowId][colId] === 0) {
                    continue;
                }

                const blockX = posX + colId;
                const blockY = posY + rowId;

                if (blockX < 0 || blockX > totalCols || blockY >= totalRows) {
                    return false;
                }
                if (!cells[blockY][blockX] || !cells[blockY][blockX].isEmpty) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Calculating of a current tetromino position for a next tick
     * @param posX
     * @param posY
     * @param config
     * @return {Array} new position matrix
     */
    render(posX, posY, config) {
        let filledCells = []; //{x, y}
        let blockIndex = 0;

        for (let rowId = 0; rowId < this.blocksData.length; rowId++) {
            for (let colId = 0; colId < this.blocksData[rowId].length; colId++) {
                if (this.blocksData[rowId][colId] > 0) {
                    const block = this.blocks[blockIndex];
                    const blockX = posX + colId;
                    const blockY = posY + rowId;

                    block.x = (blockX * config.width);
                    block.y = (blockY * config.height);
                    block.width = config.width;
                    block.height = config.height;

                    filledCells.push({x: blockX, y: blockY});
                    blockIndex++;
                }
            }
        }
        return filledCells;
    }

    /**
     * Calculating of blocks height number
     * @return {number}
     */
    get height() {
        let heightCounter = 0;

        this.blocksData.forEach(row => {
            for (let cellId = 0; cellId < row.length; cellId++) {
                if (row[cellId] > 0) {
                    heightCounter++;
                    break;
                }
            }
        });

        return heightCounter;
    }

    /**
     * Calculating of blocks width number
     * @return {number}
     */
    get width() {
        let widthCounter = 0;

        this.blocksData.forEach(row => {
            let rowWidth = 0;
            for (let cellId = 0; cellId < row.length; cellId++) {
                if (row[cellId] > 0) {
                    rowWidth++;
                }

            }
            widthCounter = Math.max(widthCounter, rowWidth);
        });

        return widthCounter;
    }

    /**
     * Calculating of matrix first block index
     * @return {*}
     */
    get localPositionX() {
        let posCounter = this.blocksData[0].length;

        this.blocksData.forEach(row => {
            if (row.indexOf(1) === -1) {
                return;
            }
            posCounter = Math.min(row.indexOf(1), posCounter);
        });

        return posCounter;
    }

}