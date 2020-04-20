export default class ConfigData {
    static readonly GAME_NAME = "game_name";
    static readonly VERSION = 100;

    //后台获取的id
    static GameId: string = "";
    //场景值
    static Scene: string = "0";
    //登录返回code
    static Code: string = "";
    //OpenId
    static OpenId: string = "";

    //是否开启误点
    static IsMisLead: boolean = false;
    //是否开启版本控制
    static IsStatus: boolean = false;
}

export class LocalStorageKey {
    public static readonly COIN = "COIN";
}