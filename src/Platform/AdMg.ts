import PlatformMg from "./PlatformMg";
import WxAdUtil from "./WxAdUtil";
import QqAdUtil from "./QqAdUtil";
import OppoAdUtil from "./OppoAdUtil";
import VivoAdUtil from "./VivoAdUtil";
import BdAdUtil from "./BdAdUtil";
import WindowUtil from "../Utils/WindowUtil";
import TtAdUtil from "./TtAdUtil";

/**
 * 广告管理类
 */
export default class AdMg {
    private static _instance: AdMg;
    public static get Instance(): AdMg {
        if (!this._instance) {
            this._instance = new AdMg();
        }
        return this._instance;
    }
    //banner广告中间位置坐标
    ADMidleY = 0;

    hadInit = false;

    //banner展示的类型
    showType: number = 0;
    showBannerDialog: Laya.Dialog;

    /**
    * 广告工具类初始化
    */
    public init() {
        switch (PlatformMg.Instance.platformName) {
            case PlatformMg.Instance.Wx:
                PlatformMg.Instance.onWx && WxAdUtil.Instance.init();
                break;
            case PlatformMg.Instance.Qq:
                PlatformMg.Instance.onQq && QqAdUtil.Instance.init();
                break;
            case PlatformMg.Instance.Oppo:
                PlatformMg.Instance.onOppo && OppoAdUtil.Instance.init();
                break;
            case PlatformMg.Instance.Vivo:
                PlatformMg.Instance.onVivo && VivoAdUtil.Instance.init();
                break;
            case PlatformMg.Instance.Bd:
                PlatformMg.Instance.onBd && BdAdUtil.Instance.init();
                break;
            case PlatformMg.Instance.Tt:
                PlatformMg.Instance.onTt && TtAdUtil.Instance.init();
                break;
            default:
                break;
        }
        this.hadInit = true;
    }

    /**
     * 显示banner广告
     * @param data 
     */
    showBanner(data: any = {}) {
        if (!this.hadInit) {
            return;
        }

        switch (PlatformMg.Instance.platformName) {
            case PlatformMg.Instance.Wx:
                WxAdUtil.Instance.showBanner(data);
                break;
            case PlatformMg.Instance.Qq:
                QqAdUtil.Instance.showBanner();
                break;
            case PlatformMg.Instance.Tt:
                TtAdUtil.Instance.showBanner();
                break;
            case PlatformMg.Instance.Oppo:
                OppoAdUtil.Instance.showBanner();
                break;
            case PlatformMg.Instance.Vivo:
                VivoAdUtil.Instance.showBanner();
                break;
            case PlatformMg.Instance.Bd:
                BdAdUtil.Instance.showBanner(data);
                break;
            default:
                break;
        }
    }

    /**
     * 隐藏banner广告
     */
    hideBanner() {
        if (!this.hadInit) {
            return;
        }

        switch (PlatformMg.Instance.platformName) {
            case PlatformMg.Instance.Wx:
                WxAdUtil.Instance.hideBanner();
                break;
            case PlatformMg.Instance.Qq:
                QqAdUtil.Instance.hideBanner();
                break;
            case PlatformMg.Instance.Tt:
                TtAdUtil.Instance.hideBanner();
                break;
            case PlatformMg.Instance.Oppo:
                OppoAdUtil.Instance.hideBanner();
                break;
            case PlatformMg.Instance.Vivo:
                VivoAdUtil.Instance.hideBanner();
                break;
            case PlatformMg.Instance.Bd:
                BdAdUtil.Instance.hideBanner();
                break;
            default:
                break;
        }
    }

    /**
     * 调用视频广告
     * @param options 
     */
    showVideo(options: any = {}) {
        if (!this.hadInit) {
            options.success && options.success();
            return;
        }

        switch (PlatformMg.Instance.platformName) {
            case PlatformMg.Instance.Wx:
                WxAdUtil.Instance.video(options);
                break;
            case PlatformMg.Instance.Qq:
                QqAdUtil.Instance.video(options);
                break;
            case PlatformMg.Instance.Tt:
                TtAdUtil.Instance.video(options);
                break;
            case PlatformMg.Instance.Oppo:
                OppoAdUtil.Instance.video(options);
                break;
            case PlatformMg.Instance.Vivo:
                VivoAdUtil.Instance.video(options);
                break;
            case PlatformMg.Instance.Bd:
                BdAdUtil.Instance.video(options);
                break;
            default:
                options.fail && options.fail();
                break;
        }
    }

    /**
     * 调用分享
     * @param options 
     */
    share(options: any = {}) {
        if (!this.hadInit) {
            options.success && options.success();
            return;
        }

        switch (PlatformMg.Instance.platformName) {
            case PlatformMg.Instance.Wx:
                WxAdUtil.Instance.share(options);
                break;
            case PlatformMg.Instance.Qq:
                QqAdUtil.Instance.share(options);
                break;
            case PlatformMg.Instance.Tt:
                TtAdUtil.Instance.share(options);
                break;
            default:
                options.fail && options.fail();
                break;
        }
    }

    /**
     * 设置banner位置信息
     * @param bannerAd 
     */
    setADMidleY(bannerAd: any) {
        if (bannerAd == null) {
            this.ADMidleY = 0;
        } else if (this.ADMidleY == 0) {
            let top = bannerAd.style.top;
            let h = bannerAd.style.realHeight;
            let y = top + h / 2;
            this.ADMidleY = y * WindowUtil.clientScale;
        }
    }

    getADMidleY() {
        return this.ADMidleY;
    }
}















