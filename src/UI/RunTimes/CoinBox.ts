import EventCenter, { EventName } from "../../Utils/EventCenter";
import PlatformMg from "../../Platform/PlatformMg";
import CoinMg from "../../Manages/CoinMg";

/**
 * 设置给coinBox 预制体
 */
export default class CoinBox extends Laya.Box {
    coinLb: Laya.Label;

    onAwake() {
        EventCenter.getInstance().on(EventName.CoinBox_RefreshCoin, this.refresh, this);
        this.coinLb = this.getChildByName("coinLb") as Laya.Label;
        this.refresh();
    }

    onEnable() {
        PlatformMg.Instance.topMidle(this);
    }

    refresh() {
        this.coinLb.text = String(CoinMg.Instance.getCoin());
    }
}