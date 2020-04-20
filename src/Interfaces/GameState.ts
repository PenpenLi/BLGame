interface GameState {
    //游戏开始
    gameStart();
    //游戏暂停
    gamePause();
    //游戏重新开始
    gameRestart();
    //游戏复活
    gameRelive();
    //游戏结束
    gameOver();
    //游戏完成
    gameFinish();
}