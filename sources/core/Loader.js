export default class Loader extends PIXI.loaders.Loader{
    /**
     * Override for a PIXI loader
     * @constructor
     * @param baseUrl
     * @param concurrency
     * @param config
     */
    constructor(config, baseUrl = '', concurrency = 20) {
        super(baseUrl, concurrency);
        this._config = config;
    }

    /**
     * adding and starting loading of resources
     * @param cb {Function} resolver
     */
    startLoading(cb){
        for(let i = 0; i < this._config.length; i++){
            super.add(this._config[i].name, this._config[i].path, { crossOrigin: true })
        }
        super.load((loader, resources)=>{
            let images = {};
            for (let image in resources) {
                images[image] = new PIXI.Texture(new PIXI.BaseTexture(resources[image].data));
            }
            this._resolver(images);
        });
        this._resolver = cb;
    }
}