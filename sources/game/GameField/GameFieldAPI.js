import GameFieldView from './GameFieldView';
import GameFieldController from './GameFieldController';

export default class GameField {
    /**
     * Game Field class
     * @param respack {Object} resources pack
     * @param parent {PIXI.DisplayObject}
     */
    constructor(respack, parent){
        this.view =       new GameFieldView(respack, parent);
        this.controller = new GameFieldController(this.view);
    }
}