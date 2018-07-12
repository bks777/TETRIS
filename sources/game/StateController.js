export default class StateController {
    /**
     * State controller class
     * @param statesArray {Array} array of allowed states
     */
    constructor(statesArray) {
        this._currentState = null;
        this.legalStates = statesArray;
    }

    /**
     * getting of a current game state
     * @return {String}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * Setting of a current state
     * @param name {String}
     */
    set currentState(name) {
        if (this.legalStates.indexOf(name) !== -1) {
            this._currentState = name;
            console.info(`state setted to [${name}]`);
        } else {
            throw new Error(`game state [${name}] is not legal!`);
        }
    }
}