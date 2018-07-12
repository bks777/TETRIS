import Loader from "./Loader";

export default class GameRunner {
    /**
     * @constructor
     * @param config
     */
    constructor(config) {
        this.config = config;
        this._respack = null;
        this._modules = {};
    }

    /**
     * Loads all resources, makes PIXI.Sprite-s
     * @param resolve {Function} resolver
     * @private
     */
    _startResourcesLoading(resolve) {
        this.loader = new Loader(this.config['images']);
        this.loader.startLoading(resolve);
    }

    /**
     * Start game logic, loads all components
     * @private
     */
    _startLogic() {
        console.info(`[${game.config.name}]: Logic started`);
        //Initializing of modules
        for (let Module of game.MODULES) {
            this._modules[Module.name] = new Module(this._respack, this.stage);
            console.info(`Module ${Module.name} was attached`);
        }
    }

    /**
     * Entry point
     */
    run() {
        this.initRenderer('container', game.config.width, game.config.height);
        new Promise(resolve => {
            this._startResourcesLoading(resolve);
        }).then((resources) => {
            this._respack = resources;
            this._startLogic();
        })
    }

    /**
     * Creates PIXI renderer and start frames ticker
     * @param parent {String} parent node id for a PIXI stage
     * @param width {Number} width of a stage
     * @param height {Number} height of a stage
     */
    initRenderer(parent = 'container', width = 640, height = 640) {
        PIXI.utils.skipHello();
        let renderer = PIXI.autoDetectRenderer({
                width, height,
                transparent: true,
                antialias: true
            }, false),
            stage = new PIXI.Container(),

            ticker = new PIXI.ticker.Ticker();
        document.getElementById(parent).appendChild(renderer.view);
        ticker.add(() => {
            renderer.render(stage);
        });
        ticker.start();
        this.stage = stage;
        this.ticker = game._ticker = ticker;
        PIXI.customTicker = ticker;
    }
}