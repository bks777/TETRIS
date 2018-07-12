export default class GameFieldController {
    /**
     * Field class controller
     * @param view {GameFieldView}
     */
    constructor(view){
       this.view = view;

       this._on();
    }

    /**
     * Subscriptions for a global events
     * @private
     */
    _on() {
        game.EventManager.subscribe('KEY_PRESSED_DOWN', data => {
            this._userActions(data, true);
        });
        game.EventManager.subscribe('KEY_PRESSED_UP', data => {
            this._userActions(data, false);
        });
        game.EventManager.subscribe('AnimationControls.ADD_TETROMINO', () => {
            this.view.checkTetraminoAdding()
        });
        game.EventManager.subscribe('AnimationControls.UPDATE_SCORE', () => {
            this.view.informers.updateScore = false;
        });
    }


//////////////////////////////// USER ACTIONS ////////////////////////////////
    /**
     * User actions analyzing
     * @param config {Object} event data
     * @param isDown {Boolean} is keydown pressed
     * @private
     */
    _userActions(config, isDown) {
        const data = config._data;
        if (`${data}ActionCheck`) {
            this[`${data}ActionCheck`](isDown);
        } else {
            throw new Error(`no such action: [${data}]`);
        }
    }

    /**
     * Left move user action listener
     */
    leftActionCheck() {
        this.view.animationsControls.moveLeft();
    }

    /**
     * Right move user action listener
     */
    rightActionCheck() {
        this.view.animationsControls.moveRight();
    }

    /**
     * Speed acceleration user action listener
     * @param isDown {Boolean}
     */
    downActionCheck(isDown) {
        this.view.animationsControls.moveDelay = isDown;
    }

    /**
     * Rotation user action listener
     */
    rotateActionCheck() {
        this.view.animationsControls.rotateTetromino()
    }

    /**
     * Clearing of current table, starting new round
     */
    startNewRound() {
        this.view.startNewRound();
    }
}