export default class GameMg implements GameState {

    private static instance: GameMg;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new GameMg();
        }
        return this.instance;
    }


    gameFinish() {
    }

    gamePause() {
    }

    gameRestart() {
    }

    gameRelive() {
    }

    gameStart() {
    }

    gameOver() {
    }
}