import { LocalStorageKey } from "../Data/ConfigData";
import LocalStorageUtil from "../Utils/LocalStorageUtil";
import TipsUtil from "../Utils/TipsUtil";
import EventCenter, { EventName } from "../Utils/EventCenter";

export default class CoinMg {
    private static instance: CoinMg;
    static get Instance() {
        if (!CoinMg.instance) {
            CoinMg.instance = new CoinMg();
        }
        return CoinMg.instance;
    }

    public isDoubleCoin = false;

    //用户当前金币数
    public coin: number = 0;
    //获得的金币数
    public GetCoinTimesNumber: number
    //翻倍
    public GetCoinTimes: number = 3;
    //邀请好友获得的金币
    public ChangeFriendGetCoin: number
    /**
     * 用户金币初始化
     * @param debugNum  测试金币数 可不传
     */
    init(debugNum?: number) {
        if (debugNum) {
            this.coin = debugNum;
        } else {
            this.coin = LocalStorageUtil.getNumber(LocalStorageKey.COIN, 0);
        }

        console.log("CoinUtil init success:coin=", this.coin);
    }

    doubleCoin(isDouble: boolean) {
        this.isDoubleCoin = isDouble;
    }

    addCoin(addNum: number, isShowTips = true) {
        this.coin += addNum;
        LocalStorageUtil.setNumber(LocalStorageKey.COIN, this.coin);
        if (isShowTips) {
            TipsUtil.msg("获得" + addNum + "金币");
        }

        EventCenter.getInstance().post(EventName.CoinBox_RefreshCoin);
    }

    reduceCoin(reduceNum: number) {
        if (this.coin < reduceNum) {
            TipsUtil.msg("金币不足");
        } else {
            this.coin -= reduceNum;
            LocalStorageUtil.setNumber(LocalStorageKey.COIN, this.coin);
            EventCenter.getInstance().post(EventName.CoinBox_RefreshCoin);
        }
    }

    getCoin() {
        return this.coin;
    }
}