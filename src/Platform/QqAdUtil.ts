import WindowUtil from "../Utils/WindowUtil";
import PlatformMg from "./PlatformMg";
import TipsUtil from "../Utils/TipsUtil";
import AdMg from "./AdMg";

export default class QqAdUtil {
    private static _instance: QqAdUtil;
    public static get Instance(): QqAdUtil {
        if (!this._instance) {
            this._instance = new QqAdUtil();
        }
        return this._instance;
    }

    //最大加载次数
    private MaxLoadTime: number = 3;
    //广告banner
    private bannerAD: any;
    //广告激励视频
    private rewardedVideoAd: any;
    //广告信息
    private platformData: QqAdData;
    private adOptions: any;
    //广告banner 高度
    public realHeight: number = 0;
    public top: number = 0;

    public qqBox: any;

    //激励视频是否成功标识
    initVideoSuccess = false;

    init() {
        this.platformData = new QqAdData();
        //根据平台使用不同数据
        this.initShare();
        this.initBanner(0);
        this.initQQBox();
    }

    private initBanner(loadTime: number = 0) {
        loadTime++;
        let bannerObj;

        bannerObj = {
            adUnitId: this.platformData.bannerId,
            style: {
                left: 0,
                top: WindowUtil.gameHeight - 300,
                width: 750
            },
            adIntervals: 300
        };

        if (!bannerObj) {
            console.log("qq initBanner bannerObj=null");
            return;
        }

        let banner = PlatformMg.Instance.platform.createBannerAd(bannerObj);
        banner.onError(err => {
            if (loadTime < this.MaxLoadTime) {
                this.initBanner(loadTime);
            } else {
                console.log("banner 加载失败");
            }
        });

        banner.onLoad(() => {
            loadTime = 0;
            this.bannerAD = banner;
            if (WindowUtil.isIphoneX) {
                this.bannerAD.style.top = PlatformMg.Instance.platform.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight - (50 / WindowUtil.clientScale);
            } else {
                this.bannerAD.style.top = PlatformMg.Instance.platform.getSystemInfoSync().screenHeight - this.bannerAD.style.realHeight;
            }

        });

        banner.onResize(() => {
            AdMg.Instance.setADMidleY(banner);
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
        if (PlatformMg.Instance.onQq) {
            PlatformMg.Instance.platform.showShareMenu({
                withShareTicket: true,
            })
        }

        if (this.platformData.shareData && this.platformData.shareData.length > 0) {
            PlatformMg.Instance.platform.onShareAppMessage(() => {
                let id = Math.floor(Math.random() * this.platformData.shareData.length);
                return {
                    title: this.platformData.shareData[id].title,
                    imageUrlId: this.platformData.shareData[id].id,
                    imageUrl: this.platformData.shareData[id].url,
                }
            })
        }

    }

    showBanner(data: any = {}) {
        this.bannerAD && this.bannerAD.show();
    }

    hideBanner() {
        this.bannerAD && this.bannerAD.hide();
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
        if (this.platformData.shareData.length > 0) {
            let id = Math.floor(Math.random() * this.platformData.shareData.length);
            PlatformMg.Instance.platform.shareAppMessage({
                title: this.platformData.shareData[id].title,
                imageUrlId: this.platformData.shareData[id].id,
                imageUrl: this.platformData.shareData[id].url,
                showShareItems: null
            });

            if (options.success) {
                PlatformMg.Instance.platform.offShow(options.success);
                PlatformMg.Instance.platform.onShow(options.success);
            }
        } else {
            TipsUtil.msg("分享失败");
            options && options.fail && options.fail();
        }
    }


    qqBoxBg: Laya.Sprite;
    qqBoxOption: any;
    /**
    * onLoad 方法已废弃
    */
    initQQBox() {
        if (this.qqBox) { this.qqBox.destroy() }

        console.log("this.hzAdId=", this.platformData.boxId);
        this.qqBox = PlatformMg.Instance.platform.createAppBox({
            adUnitId: this.platformData.boxId
        });

        this.qqBox && this.qqBox.load();

        //监听用户关闭广告
        this.qqBox.onClose(() => {
            console.log('用户关闭了广告');
            if (this.qqBoxBg) {
                this.qqBoxBg.visible = false;
            }
            this.qqBoxOption && this.qqBoxOption.close && this.qqBoxOption.close();
            this.qqBoxOption = null;
        });
    }

    showBox(dialog: Laya.Dialog, option?: any) {
        this.qqBoxOption = option;
        if (!PlatformMg.Instance.onQq) {
            this.qqBoxOption && this.qqBoxOption.close && this.qqBoxOption.close();
            return;
        }

        if (this.qqBox) {
            this.qqBox.show().then(() => {
                this.qqBoxBg = new Laya.Sprite();
                this.qqBoxBg.width = WindowUtil.gameWidth;
                this.qqBoxBg.height = WindowUtil.gameHeight;
                this.qqBoxBg.graphics.drawRect(0, 0, WindowUtil.gameWidth, WindowUtil.gameHeight, "#000000");
                this.qqBoxBg.alpha = 1;
                dialog.addChild(this.qqBoxBg);
            }).catch(() => {
                this.qqBoxOption && this.qqBoxOption.close && this.qqBoxOption.close();
                this.qqBoxOption = null;
            });
        } else {
            this.qqBoxOption && this.qqBoxOption.close && this.qqBoxOption.close();
            this.qqBoxOption = null;
        }
    }
}

export class QqAdData {
    videoIds: string[] = ["90a4bc60317b4bef83c0289bd32f060c"];
    bannerId: string = "fd8b22c205d3bf01ca8ebd171548197e";
    boxId: string = "949b633c5066e30b4350186330ef3e72";
    shareData: any[] = [];
}