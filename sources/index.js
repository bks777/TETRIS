////////// CONFIGS //////////
import resources from './configurations/resources'  ;
import config    from './configurations/main_config';

////////// CORE //////////
import GameRunner           from './core/GameRunner'        ;
import EventManager         from './core/EventManager'      ;
import UserActionListener   from './core/UserActionListener';

////////// GLOBAL //////////
let game = {
    config,
    EventManager:  new EventManager(),
    UserActionListener: new UserActionListener()
};

////////// MODULES //////////
import GameField from './game/GameField/GameFieldAPI';
game.MODULES = [GameField];

window.game = game;

////////// GAME RUN //////////
const gameRunner = new GameRunner(resources);
gameRunner.run();
