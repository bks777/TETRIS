export default class EndRound extends PIXI.Container {
    /**
     * End Round screen class
     * @param config {Object} configuration
     * @param buttonTexture {PIXI.Texture} texture for a button background
     * @param parent {PIXI.DisplayObject}
     * @param callback {Function} callback for a button
     * @constructor
     */
    constructor(config, buttonTexture, parent, callback) {
        super();
        this.config = config;
        this._callback = callback;

        this.button = null;

        this._initElements(buttonTexture);
        this.position.set(config.x, config.y);
        parent.addChild(this);
    }

    /**
     * Initializing of class elements - background, text label and a button
     * @param buttonTexture {PIXI.Texture} texture for a button background
     * @private
     */
    _initElements(buttonTexture) {
        let back = new PIXI.Graphics(),
            button = new PIXI.Sprite(buttonTexture),
            label = new PIXI.Text(this.config['label'].text, this.config['label'].style),
            buttonText = new PIXI.Text(this.config['button'].text, this.config['button'].style);

        label.position.set(this.config['label'].x, this.config['label'].y);

        back.beginFill(this.config['back'].color);
        back.drawRect(0, 0, this.config['back'].width, this.config['back'].height);
        back.alpha = this.config['back'].alpha;

        buttonText.position.set(this.config['button']['text_offsets'].x, this.config['button']['text_offsets'].y);
        button.addChild(buttonText);

        button.position.set(this.config['button'].x, this.config['button'].y);
        button.mouseup = this._callback;
        this.button = button;

        this.addChild(back, label, button);
    }

    /**
     * Showing
     */
    show() {
        this.button.interactive = this.button.buttonMode = true;
        this.visible = true;
    }

    /**
     * Hiding
     */
    hide() {
        this.button.interactive = this.button.buttonMode = false;
        this.visible = false;
    }
}