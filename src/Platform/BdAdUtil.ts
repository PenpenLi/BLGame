import PlatformMg from "./PlatformMg";
import WindowUtil from "../Utils/WindowUtil";
import TipsUtil from "../Utils/TipsUtil";

/**
 * 百度广告管理类
 */
export default class BdAdUtil {
    private static _instance: BdAdUtil;
    public static get Instance(): BdAdUtil {
        if (!this._instance) {
            this._instance = new BdAdUtil();
        }
        return this._instance;
    }

    //视频 id
    private videoId = "6978637"
    //banner id
    private bannerId = "6978635"
    //游戏 id
    private appId = "d3a0fdf0"

    //最大加载次数
    private MaxLoadTime: number = 3;
    //是否正在展示banner
    private isShow: boolean = false;
    //正常banner
    private bannerAD: any;
    //观看视频后的回调方法
    private adOptions: any;
    //视频实例
    private rewardedVideoAd: any;

    init() {
    }

    initBanner(loadTime: number = 0, type?: number) {
        if (!PlatformMg.Instance.onBd) {
            return;
        }
        console.log("BdADUtil initBanner", loadTime, type);
        loadTime++;

        let bannerObj;
        if (type == 1) {
            bannerObj = {
                adUnitId: this.bannerId,
                appSid: this.appId,
                style: {
                    left: 0,
                    top: WindowUtil.gameHeight - 300,
                    width: 750
                },
                adIntervals: 300
            };
        } else {
            bannerObj = {
                adUnitId: this.bannerId,
                appSid: this.appId,
                style: {
                    left: (WindowUtil.gameWidth - 600) / WindowUtil.clientScale / 2,
                    top: WindowUtil.gameHeight - 300,
                    width: 600 / WindowUtil.clientScale
                },
                adIntervals: 300
            };
        }

        if (!bannerObj) {
            return;
        }

        if (this.bannerAD) {
            this.bannerAD.destroy();
            this.bannerAD = null;
        }

        this.bannerAD = PlatformMg.Instance.platform.createBannerAd(bannerObj);

        this.bannerAD.onError(err => {
            if (loadTime < this.MaxLoadTime) {
                this.initBanner(loadTime, type);
            } else {
                this.showBannerWithRefresh(null, type);
            }
        });

        this.bannerAD.onLoad(() => {
            this.showBannerWithRefresh(this.bannerAD, type);
        });

        this.bannerAD.onResize(() => {
            if (WindowUtil.isIphoneX) {
                this.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight - (50 / WindowUtil.clientScale);
            } else {
                this.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight;
            }
        })
    }

    showBanner(data: any = {}) {
        if (!PlatformMg.Instance.onBd) {
            return;
        }

        if (data && data.type) {
            let type = 1;
            this.isShow = true;
            type = data.type;
            if (this.bannerAD) {
                this.showBannerWithRefresh(this.bannerAD, data.type);
            } else {
                this.initBanner(0, data.type);
            }
        } else {
            console.error("showBanner 参数不正确");
        }
    }

    hideBanner() {
        if (!PlatformMg.Instance.onBd) {
            return;
        }

        this.isShow = false;
        if (this.bannerAD) { this.bannerAD.hide(); }
        Laya.timer.clearAll(this);
    }

    /**
     * banner 自动刷新
     * @param banner banner 实例
     * @param type banner类型
     */
    showBannerWithRefresh(banner: any, type: number) {
        if (!PlatformMg.Instance.onBd) {
            return;
        }

        if (banner && banner != null && this, this.isShow) {
            banner.show();
        }

        Laya.timer.clearAll(this);
        Laya.timer.once(10000, this, () => {
            console.log("自动刷新");
            this.initBanner(0, type)
        });
    }

    /**
     * 初始化激励视频
     * @param loadTime 初始化次数
     * @param play 是否自动播放
     */
    initVideo(loadTime = 0) {
        if (!PlatformMg.Instance.onBd) {
            return;
        }

        loadTime++;


        if (this.rewardedVideoAd) {
            return;
        } else {
            this.rewardedVideoAd = PlatformMg.Instance.platform.createRewardedVideoAd({ adUnitId: this.videoId, appSid: this.appId });

            this.rewardedVideoAd.load()
                .then(() => {
                    console.log("onLoad 成功，开始播放");
                    this.rewardedVideoAd.show().then(() => {
                        console.log("onLoad 成功，播放成功");
                        // SoundUtil.Instance().stopMusic();
                    });
                });
            //关闭监听
            this.rewardedVideoAd.onClose(res => {
                if (res.isEnded) {
                    if (this.adOptions != null && this.adOptions != undefined && this.adOptions.success)
                        this.adOptions.success();
                } else {
                    if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                        this.adOptions.fail();
                }

                // SoundUtil.Instance().playMusic();
            });

            //加载失败监听
            this.rewardedVideoAd.onError(err => {
                console.log("ad onError:", err);
                if (loadTime < this.MaxLoadTime) {
                    this.initVideo(loadTime);
                } else {
                    TipsUtil.msg("视频拉取失败");
                    if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                        this.adOptions.fail();
                }
            });
        }
    }

    /**
     * 调用视频广告
     * @param options 回调方法
     */
    video(options: any = {}): void {
        if (!PlatformMg.Instance.onBd) {
            if (this.adOptions != null && this.adOptions != undefined && this.adOptions.success)
                this.adOptions.success();
            return;
        }

        this.adOptions = options;
        if (this.rewardedVideoAd) {
            console.log("直接播放");
            this.rewardedVideoAd.load().
                then(() => {
                    this.rewardedVideoAd.show().catch(err => {
                        if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                            this.adOptions.fail();
                    });
                })
                .catch(err => {
                    if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                        this.adOptions.fail();
                });
        } else {
            console.log("先初始化，再播放");
            this.initVideo(0);
        }
    }
}