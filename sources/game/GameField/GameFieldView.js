import Tetromino from '../Tetromino';
import Cell from "../Cell";
import AnimationsControls from '../AnimationsControls';
import Informers from '../Informers';
import EndRound from '../EndRound';

import config from '../../configurations/field_config';
import tetro_data from '../../configurations/tetro_data';


export default class GameFieldView extends PIXI.Container{
    /**
     * Field class view
     * @constructor
     * @param respack {Object} resources pack
     * @param parent {PIXI.DisplayObject}
     */
    constructor(respack, parent) {
        super();
        parent.addChild(this);
        this.respack = respack;

        this.cells = [];
        this.tetro_data = tetro_data;
        this.tetro_container = null;
        this.animationsControls = null;
        this.endRound = null;
        this.informers = null;

        this._initElements();
        this._initField();
        this._initAnimationsControls();
        this._initTetrominos();
        this._initInformers();
    }

//////////////////////////////// INITIALIZING ////////////////////////////////
    /**
     * Initializing of background and PIXI.Container for a tetrominos
     * @private
     */
    _initElements() {
        let back = new PIXI.Sprite(this.respack['field_back']);
        back.position.set(config['back_position'].x, config['back_position'].y);
        this.addChild(back);
        this.tetro_container = new PIXI.Container();
        this.addChild(this.tetro_container);
        this.tetro_container.position.set(config['tetro_position'].x, config['tetro_position'].y);
        this.endRound = new EndRound(config['end_round'], this.respack['end_button'], this, () => {
            this.startNewRound();
        });
        this.endRound.hide();
    }

    /**
     * Initializing matrix array of a field
     * @private
     */
    _initField() {
        for (let rowId = 0; rowId < config['rowsNumber']; rowId++) {
            this.cells[rowId] = [];
            for (let colId = 0; colId < config['colsNumber']; colId++) {
                this.cells[rowId][colId] = new Cell();
            }
        }
    }

    /**
     * Initializing controls for animations
     * @private
     */
    _initAnimationsControls() {
        const data = {
                states: config['states'],
                rowsNumber: config['rowsNumber'],
                colsNumber: config['colsNumber'],
                moveDelay: config['moveDelay'],
                tetro_pull_length: config.tetro_pull_length,
                cell: config['cell']
            },
            configuration = {
                cells: this.cells
            };

        this.animationsControls = new AnimationsControls(data, configuration);
    }

    /**
     * Initializing of tetrominos pull
     * @private
     */
    _initTetrominos() {
        for (let tetroId = 0; tetroId < config['tetro_pull_length']; tetroId++) {
            this.animationsControls.tetrominoToPull = this.getRandomTetromino();
        }
    }

    /**
     * Initializing of game informers (next, score)
     * @private
     */
    _initInformers() {
        const data = {
            tetro_pull: this.animationsControls.tetrominos_pull,
            config,
            parent: this,
            respack: this.respack
        };

        this.informers = new Informers(data);
    }

    /**
     * Generates instance of a random Tetromino class
     * @return {Tetromino}
     */
    getRandomTetromino() {
        return new Tetromino(this.respack, this.tetro_container, this.tetro_data[Math.round(Math.random() * (this.tetro_data.length - 1))]);
    }

    /**
     * Checking for end of a game round and adding a new tetramino to the pull
     */
    checkTetraminoAdding(){
        if (!this.animationsControls.isEndRound) {
            this.animationsControls.tetrominoToPull = this.getRandomTetromino();
            this.informers.updateNextTetrominos = this.animationsControls.tetrominos_pull;
        } else {
            this.endRound.show();
        }
    }

    /**
     * Clearing of current table, starting new round
     */
    startNewRound() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                if (!cell.isEmpty) {
                    cell.clear();
                }
            })
        });
        this._initTetrominos();
        this.informers.updateScore = true;
        this.informers.updateNextTetrominos = this.animationsControls.tetrominos_pull;
        this.animationsControls.startNewRound();
        this.endRound.hide();
    }
}