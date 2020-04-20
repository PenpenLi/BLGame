import PlatformMg from "./PlatformMg";
import WindowUtil from "../Utils/WindowUtil";
import TipsUtil from "../Utils/TipsUtil";
import ADUtil from "./AdMg";
import AdMg from "./AdMg";
import BannerDefaultSprite from "../UI/RunTimes/BannerDefaultSprite";
import LeadOutMg from "../Manages/LeadOutMg";

export default class WxAdUtil {
    private static _instance: WxAdUtil;
    public static get Instance(): WxAdUtil {
        if (!this._instance) {
            this._instance = new WxAdUtil();
        }
        return this._instance;
    }

    //是否加载完成
    private hadLoad = false;

    //最大加载次数
    private MaxLoadTime: number = 3;
    //微信广告banner
    private bannerAD: any;
    //微信广告banner
    private startBannerAD: any;
    //微信广告激励视频
    private rewardedVideoAd: any;
    //微信广告信息
    private platformData: any = null;

    private adOptions: any;

    private leadOut5Spr: BannerDefaultSprite;

    //记录显示banner 的dialog
    private showBannerDialog: Laya.Dialog;
    //展示的类型
    public showType: number = 0;
    //是否正在展示banner
    private isShow: boolean = false;


    //微信广告banner 高度
    public realHeight: number = 0;
    public top: number = 0;
    //激励视频是否成功标识
    initVideoSuccess = false;

    init() {
        //根据平台使用不同数据
        if (PlatformMg.Instance.onWx) {
            this.platformData = WxAdData;
            this.initShare();
            this.initBanner(0, 1);
            this.initBanner(0, 2);
        }
    }

    showBanner(data: any) {
        if (!PlatformMg.Instance.onWx) {
            return;
        }

        if (data && data.type && data.dialog) {
            this.showType = data.type;
            this.showBannerDialog = data.dialog;
            this.isShow = true;

            if (this.showType == 1) {
                if (this.hadLoad && this.bannerAD) {
                    this.showBannerWithRefresh(this.bannerAD, this.showType);
                } else {
                    if (this.showBannerDialog && LeadOutMg.checkBannerGameList) {
                        this.leadOut5Spr = new BannerDefaultSprite(this.showType);
                        this.showBannerDialog.addChild(this.leadOut5Spr);
                    }
                }
            } else {
                if (this.startBannerAD && this.startBannerAD) {
                    this.showBannerWithRefresh(this.startBannerAD, this.showType);
                } else {
                    if (this.showBannerDialog && LeadOutMg.checkBannerGameList) {
                        this.leadOut5Spr = new BannerDefaultSprite(this.showType);
                        this.showBannerDialog.addChild(this.leadOut5Spr);
                    }
                }
            }
        } else {
            console.error("showBanner 参数不正确");
        }
    }

    hideBanner() {
        if (!PlatformMg.Instance.onWx) {
            return;
        }

        this.isShow = false;
        this.showType = 0;
        this.showBannerDialog = null;
        if (this.bannerAD) { this.bannerAD.hide(); }
        if (this.startBannerAD) { this.startBannerAD.hide(); }
        Laya.timer.clearAll(this);
    }

    showBannerWithRefresh(banner: any, type: number) {
        if (!PlatformMg.Instance.onWx) {
            return;
        }

        banner.show();

        if (this.leadOut5Spr) {
            this.leadOut5Spr.visible = false;
            this.leadOut5Spr.removeSelf();
        }

        Laya.timer.clearAll(this);
        Laya.timer.loop(10000, this, () => {
            this.initBanner(0, type)
        });
    }

    initBanner(loadTime: number = 0, type?: number) {
        if (!PlatformMg.Instance.onWx) {
            return;
        }

        loadTime++;

        let bannerObj;
        if (type == 1) {
            bannerObj = {
                adUnitId: this.platformData.bannerId,
                style: {
                    left: 0,
                    top: WindowUtil.gameHeight - 300,
                    width: 750
                },
                adIntervals: 300
            };
        } else {
            bannerObj = {
                adUnitId: this.platformData.bannerId,
                style: {
                    left: (WindowUtil.gameWidth - 600) / WindowUtil.clientScale / 2,
                    top: WindowUtil.gameHeight - 300,
                    width: 600 / WindowUtil.clientScale
                },
                adIntervals: 300
            };
        }

        if (!bannerObj) {
            console.log("wx initBanner bannerObj=null");
            return;
        }

        let banner = PlatformMg.Instance.platform.createBannerAd(bannerObj);

        banner.onError(err => {
            if (loadTime < this.MaxLoadTime) {
                this.initBanner(loadTime, type);
            } else {
                if (this.isShow) {
                    if (type == 1) {
                        if (this.bannerAD) {
                            // ADUtil.showBannerWithRefresh(ADUtil.bannerAD, type);
                        } else {
                            this.hadLoad = false;
                            // this.leadOut5Spr = new LeadOut5RunTime(this.showType);
                            // this.showBannerDialog.addChild(this.leadOut5Spr);
                        }
                    } else {

                        if (this.startBannerAD) {
                            // ADUtil.showBannerWithRefresh(ADUtil.startBannerAD, type);
                        } else {
                            // this.leadOut5Spr = new LeadOut5RunTime(this.showType);
                            // this.showBannerDialog.addChild(this.leadOut5Spr);
                        }
                    }
                } else {
                    if (type == 1) {
                        this.hadLoad = false;
                    }
                }
            }
        });

        banner.onLoad(() => {
            loadTime = 0;
            this.hadLoad = true;
            if (type == 1) {
                if (this.bannerAD) {
                    this.bannerAD.hide();
                    this.bannerAD.destroy();
                    this.bannerAD = null;
                }
                this.bannerAD = banner;

                if (WindowUtil.isIphoneX) {
                    this.bannerAD.style.top = PlatformMg.Instance.platform.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight - (50 / WindowUtil.clientScale);
                } else {
                    this.bannerAD.style.top = PlatformMg.Instance.platform.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight;
                }

                if (this.isShow && this.showType == 1) {
                    this.showBannerWithRefresh(this.bannerAD, type);
                }
            } else {
                if (this.startBannerAD) {
                    this.startBannerAD.hide();
                    this.startBannerAD.destroy();
                    this.startBannerAD = null;
                }

                this.startBannerAD = banner;
                this.startBannerAD.style.top = PlatformMg.Instance.platform.getSystemInfoSync().screenHeight - this.startBannerAD.style.realHeight;

                if (this.isShow && this.showType == 2) {
                    this.showBannerWithRefresh(this.startBannerAD, type);
                }
            }
        });

        banner.onResize(() => {
            if (type == 1) {
                AdMg.Instance.setADMidleY(banner);
            }
        })
    }



    //初始化激励视频
    private initVideo(loadTime = 0, play: boolean = false) {
        loadTime++;
        if (this.rewardedVideoAd) {
            this.rewardedVideoAd.destroy();
            this.rewardedVideoAd = null;
        }

        //随机获得激励视频id
        this.rewardedVideoAd = PlatformMg.Instance.platform.createRewardedVideoAd({ adUnitId: this.platformData.videoIds[0] });
        this.rewardedVideoAd.load();

        //关闭监听
        this.rewardedVideoAd.onClose(res => {
            if (res.isEnded) {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.success)
                    this.adOptions.success();
            } else {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                    this.adOptions.fail();
            }

            // SoundUtil.Instance().playBgm();

            this.initVideoSuccess = false;
            play = false;
        });

        //加载成功监听
        this.rewardedVideoAd.onLoad(() => {
            this.initVideoSuccess = true;

            if (play) {
                this.rewardedVideoAd.show();
            }
        });

        //加载失败监听
        this.rewardedVideoAd.onError(err => {
            if (loadTime < this.MaxLoadTime) {
                this.initVideo(loadTime, play);
            } else {
                this.initVideoSuccess = true;
            }
        });
    }


    //分享初始化
    private initShare() {
        if (PlatformMg.Instance.isWx) {
            PlatformMg.Instance.platform.showShareMenu({
                withShareTicket: true,
            })
        }

        PlatformMg.Instance.platform.onShareAppMessage(() => {
            if (PlatformMg.Instance.isWx) {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    let id = Math.floor(Math.random() * this.platformData.ShareData.length);
                    return {
                        title: this.platformData.ShareData[id].title,
                        imageUrlId: this.platformData.ShareData[id].id,
                        imageUrl: this.platformData.ShareData[id].url,
                    }
                }
            }
        })
    }

    video(options: any = {}): void {
        this.adOptions = options
        if (this.initVideoSuccess && this.rewardedVideoAd) {
            this.rewardedVideoAd.show();
        } else if (!this.initVideoSuccess && !this.rewardedVideoAd) {
            this.initVideo(0, true);
        } else {
            this.share(this.adOptions);
        }
    }

    share(options: any = {}) {
        if (this.platformData.ShareData.length > 0) {
            let id = Math.floor(Math.random() * this.platformData.ShareData.length);
            PlatformMg.Instance.platform.shareAppMessage({
                title: this.platformData.ShareData[id].title,
                imageUrlId: this.platformData.ShareData[id].id,
                imageUrl: this.platformData.ShareData[id].url,
                showShareItems: null
            });

            if (options.success) {
                PlatformMg.Instance.platform.offShow(options.success);
                PlatformMg.Instance.platform.onShow(options.success);
            }
        } else {
            TipsUtil.msg("分享失败");
        }
    }
}


export class WxAdData {
    static videoIds: string[] = ["adunit-62aee4aa114883ac"];
    static bannerId: string = "adunit-71c53559de23e7a9";

    static ShareData = [
        {
            title: " 我摩托车王者，邀你一起来飙车！",
            url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwYqtnL2mG5u34NzGibTC74XCe1TZekkMKD8lOtPQFFSthR3f1YicKr7jn/0",
            id: "7BlYgYB9TvqhCFoZi5pf0A=="
        },
        {
            title: "极限摩托竞速，有本事就来赢我！",
            url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54Wwb9n4z49vXkPaOO1EI4V5cJDrSVKOZ5n3kQFXEK6AVtfibTUIlbT1byic/0",
            id: "P+8A+eRlQ4imAKCiunPcEg=="
        }
    ];
}

