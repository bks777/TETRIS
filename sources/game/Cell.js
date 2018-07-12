export default class Cell {
    /**
     * Single cell class
     * @constructor
     */
    constructor() {
        this.sprite = null;
    }

    /**
     * is cell filled with an image
     * @return {boolean}
     */
    get isEmpty() {
        return this.sprite === null;
    }

    /**
     * fill cell with an image
     * @param sprite
     */
    addBlock(sprite) {
        this.sprite = sprite;
    }

    /**
     * removing image
     */
    clear() {
        this.sprite.parent.removeChild(this.sprite);
        this.sprite = null;
    }

    /**
     * update cell's vertical position
     */
    moveDown() {
        this.sprite.y += this.sprite.height;
    }

}