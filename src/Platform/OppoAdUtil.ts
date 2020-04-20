import PlatformMg from "./PlatformMg";

/**
 * oppo 广告
 */
export default class OppoAdUtil {
    private static _instance: OppoAdUtil;
    public static get Instance(): OppoAdUtil {
        if (!this._instance) {
            this._instance = new OppoAdUtil();
        }
        return this._instance;
    }


    VIDEO_ID = "134256";
    BANNER_ID = "134254";
    APP_ID = "30213416";

    //激励视频广告实例
    videoAd: any;
    //激励视频广告
    adOptions: any;

    //banner广告实例
    bannerAd: any;
    //banner 是否显示
    isShowBanner = false;

    //加载次数
    loadTime = 0;

    /**
     * 初始化工具类
     */
    init() {
        if (PlatformMg.Instance.onOppo) {
            //广告初始化
            this.initAD();
            //激励视频初始化
            this.initVideo();
        }
    }


    private initAD() {
        PlatformMg.Instance.platform.initAdService({
            appId: this.APP_ID,
            isDebug: false,
            success: function (res) {
                console.log("oppo initAD success");
            },
            fail: function (res) {
                console.log("oppo initAD fail:" + res.code + res.msg);
            },
            complete: function (res) {
                console.log("oppo initAD complete");
            }
        })
    }

    private initVideo() {
        if (!PlatformMg.Instance.onOppo) {
            return;
        }

        this.videoAd = PlatformMg.Instance.platform.createRewardedVideoAd({
            posId: this.VIDEO_ID,
        })

        this.videoAd.onLoad(() => {
            this.loadTime = 0;
            this.videoAd.show();
        });

        this.videoAd.onVideoStart(() => {
        });

        this.videoAd.onError((err) => {
            console.log("oppo video onError:", err);
            this.loadTime++;
            if (this.loadTime >= 3) {
                this.loadTime = 0;
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.error) {
                    this.adOptions.error();
                }
            } else {
                this.videoAd.load();
            }
        });

        this.videoAd.onClose((res) => {
            console.log("oppo video onClose:", res.isEnded);
            if (res.isEnded) {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.success)
                    this.adOptions.success();
            } else {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                    this.adOptions.fail();
            }
        });
    }

    private initBanner() {
        if (!PlatformMg.Instance.onOppo) {
            return;
        }

        if (this.isShowBanner) {
            return;
        } else {
            this.isShowBanner = true;
            Laya.timer.once(500, this, () => {
                this.bannerAd = PlatformMg.Instance.platform.createBannerAd({
                    posId: this.BANNER_ID
                })
                this.bannerAd.show();
            })
        }
    }

    /**
     * 播放激励视频
     * @param options 回调方法
     */
    video(options: any = {}): void {
        if (!PlatformMg.Instance.onOppo) {
            return;
        }

        this.adOptions = options;
        this.videoAd.load();
    }

    /**
     * 显示banner广告
     * @param data 
     */
    showBanner(data: any = {}) {
        if (!this.isShowBanner) {
            this.initBanner();
        }
    }

    /**
    * 隐藏banner广告
    */
    hideBanner() {
        Laya.timer.clearAll(this);

        if (this.bannerAd != null && this.isShowBanner) {
            this.isShowBanner = false;
            this.bannerAd.destroy();
        }
    }
}
