export default class Informers {
    /**
     * Next data and score informers
     * @constructor
     * @param data {Object}
     * * tetro_pull {Array} Array of generated tetrominos
     * * config {Object} common config
     * * parent {PIXI.DisplayObject}
     * * respack {Object} resources
     */
    constructor(data) {
        this._data = data;
        this.respack = data.respack;
        this.config = data.config;
        this._score = 0;

        this.nextContainer = new PIXI.Container();
        this.scoreContainer = new PIXI.Container();
        this._scoreText = null;

        this._tempTetraminos = [];

        this._initNextData();
        this._initScoreField();
    }

//////////////////////////////// INITIALIZING ////////////////////////////////
    /**
     * Initializing of next container elements
     * @private
     */
    _initNextData() {
        const init_tetro_pull = this._data['tetro_pull'],
            position = this.config['next_position'];
        this.nextContainer.position.set(position.x, position.y);
        this.updateNextTetrominos = init_tetro_pull;
        this._data.parent.addChild(this.nextContainer);
    }

    /**
     * Initializing of score container text label
     * @private
     */
    _initScoreField() {
        this._scoreText = new PIXI.Text('' + this._score, this.config['score']['style']);
        this.scoreContainer.addChild(this._scoreText);
        this._scoreText.anchor.set(.5, .5);
        this.scoreContainer.position.set(this.config['score'].x, this.config['score'].y);

        this._data.parent.addChild(this.scoreContainer);
    }

    /**
     * Generating of a new tetromonis pull
     * @param tetroPull {Array} Array of generated tetrominos
     * @private
     */
    _generateTetrominos(tetroPull) {
        if (this._tempTetraminos.length > 0) {
            this._tempTetraminos.forEach(tetramino => {
                tetramino.parent.removeChild(tetramino);
            });
            this._tempTetraminos.length = 0;
        }

        for (let tetroIdx = 0; tetroIdx < tetroPull.length; tetroIdx++) {
            let tempConfig = tetroPull[tetroIdx].config,
                tempBlock,
                tempTetromino = new PIXI.Sprite(PIXI.Texture.EMPTY);

            tempConfig['mtrx'].forEach((row, rowId) => {
                row.forEach((column, colId) => {
                    if (column === 1) {
                        tempBlock = new PIXI.Sprite(this.respack[[`block_${tempConfig.color}`]]);
                        tempBlock.x = colId * this.config['cell'].width;
                        tempBlock.y = rowId * this.config['cell'].height;
                        tempTetromino.addChild(tempBlock);
                    }
                })
            });
            this.nextContainer.addChild(tempTetromino);
            tempTetromino.y = this.config['next_position']['offsets_y'][tetroIdx];
            if (tempConfig.color === 'violet') {
                tempTetromino.x += this.config['cell'].width / 2;
            }
            this._tempTetraminos.push(tempTetromino);
        }
    }

//////////////////////////////// GETTERS | SETTERS ////////////////////////////////
    /**
     * updating next tetrominos section
     * @param tetroPull {Array} Array of generated tetrominos
     */
    set updateNextTetrominos(tetroPull) {
        this._generateTetrominos(tetroPull);
    }

    /**
     * updating score section
     * @param isClear {Boolean}
     */
    set updateScore(isClear) {
        isClear ? this._score = 0 : this._score += 10;
        this._scoreText.text = '' + this._score;
    }
}