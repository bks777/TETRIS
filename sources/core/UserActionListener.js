export default class UserActionListener {
    constructor() {
        this._addKeyboardListener();
    }

    _addKeyboardListener() {
        const onKeyDown = event => {
            const keys = {
                37: 'left',
                39: 'right',
                40: 'down',
                32: 'down',
                38: 'rotate'
            };
            if (typeof(keys[event.keyCode]) != 'undefined') {
                game.EventManager.dispatch('KEY_PRESSED_DOWN', keys[event.keyCode]);
            }
        };

        const onKeyUp = event => {
            const keys = {
                40: 'down',
                32: 'down'
            };
            if (typeof(keys[event.keyCode]) != 'undefined') {
                game.EventManager.dispatch('KEY_PRESSED_UP', keys[event.keyCode]);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }
}