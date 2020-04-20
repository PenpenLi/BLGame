import PlatformMg from "./PlatformMg";
import TipsUtil from "../Utils/TipsUtil";
import LocalStorageUtil from "../Utils/LocalStorageUtil";

/**
 * vivo 广告管理类
 */
export default class VivoAdUtil {
    private static _instance: VivoAdUtil;
    public static get Instance(): VivoAdUtil {
        if (!this._instance) {
            this._instance = new VivoAdUtil();
        }
        return this._instance;
    }

    private static readonly VIVO_VIDEO_ID = "be0efdc6bef248b6a602b24dc3bf29af";
    private static readonly VIVO_BANNER_ID = "ed2a0362a8d641c3aaf7145b5b098c0f";
    private static readonly VIVO_INTERSTITIA_ID = "12d245535e314858a3c0f99468d08faa";
    private static readonly VIVO_NATIVE_ID = "bbb9d314322141e1a593f95a1d138461";

    //banner广告实例
    bannerAd;
    //插屏广告实例
    interstitiaAd;
    //原生广告实例
    nativeAd;

    nativeList: VivoNativeAdBean[] = [];

    //视频是否播放中
    isPalyVideo = false;
    //视频广告实例
    videoAd;
    //回调方法
    adOptions;

    logLb: Laya.Label;
    logTxt: string = "";

    init() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        this.initVideo();
        this.initBanner();
        // this.initNativeAd();

        // if (!this.logLb) {
        //     this.logLb = new Laya.TextArea();
        //     Laya.stage.addChild(this.logLb);
        //     this.logLb.pos(0, 300);
        //     this.logLb.fontSize = 40;
        //     this.logLb.color = "#ffff00";
        //     this.logLb.text = this.logTxt;
        //     this.logLb.zOrder = 99999;
        // }
    }

    // showLog(txt: string) {
    //     if (this.logLb) {
    //         if (this.logTxt.length == 0) {
    //             this.logTxt += (txt);
    //         } else {
    //             this.logTxt += ("\n" + txt);
    //         }
    //         // this.logTxt += ("\n" + txt);
    //         // if (this.logTxt.split("\n").length >= 10) {
    //         //     this.logTxt = this.logTxt.substring(0, this.logTxt.indexOf("\n"));
    //         // }
    //         this.logLb.text = this.logTxt;
    //     }
    // }

    hadLoaded = false;

    initVideo() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        this.videoAd = PlatformMg.Instance.platform.createRewardedVideoAd({
            posId: VivoAdUtil.VIVO_VIDEO_ID,
        })

        this.videoAd.onLoad(() => {
            this.hadLoaded = true;
        });

        this.videoAd.onError((err) => {
            TipsUtil.msg("视频冷却中,请稍后再试...");
            this.hadLoaded = false;
            if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail) {
                this.adOptions.fail();
            }

            Laya.timer.once(60 * 1000, this, () => {
                this.videoAd.load();
            })
        });

        this.videoAd.onClose((res) => {
            this.hadLoaded = false;
            this.isPalyVideo = false;

            if (LocalStorageUtil.getBoolean("isPlayMusic", true)) {
                // SoundUtil.Instance().playMusic();
            } else {
                // SoundUtil.Instance().stopMusic();
            }

            if (res.isEnded) {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.success)
                    this.adOptions.success();
            } else {
                if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail)
                    this.adOptions.fail();
            }

            Laya.timer.once(60 * 1000, this, () => {
                this.videoAd.load();
            })
        });
    }

    video(options: any = {}): void {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        this.adOptions = options;

        if (this.hadLoaded) {
            this.isPalyVideo = true;
            this.videoAd.show();
            // SoundUtil.Instance().stopMusic();
        } else {
            TipsUtil.msg("视频冷却中,请稍后再试...");
            if (this.adOptions != null && this.adOptions != undefined && this.adOptions.fail) {
                this.adOptions.fail();
            }
        }
    }

    initBanner() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        // style: {}  不设置任何属性，则是底部居中  不设置style：顶部居中
        this.bannerAd = PlatformMg.Instance.platform.createBannerAd({
            posId: VivoAdUtil.VIVO_BANNER_ID,
            style: {}
        })

        this.bannerAd.onLoad(() => {
            this.bannerAd.show();
        });

        this.bannerAd.onError(err => {
            Laya.timer.once(10000, this, () => {
                this.initBanner();
            })
        });
    }

    showBanner(data: any = {}) {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }
        this.initBanner();
    }

    hideBanner() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }

    interstitiaLoadMaxTimes = 3;
    initInterstitia(loadTimes = 1) {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        this.interstitiaAd = PlatformMg.Instance.platform.createInterstitialAd({
            posId: VivoAdUtil.VIVO_INTERSTITIA_ID
        });

        this.interstitiaAd.onLoad(() => {
            console.log("插屏广告加载成功");
            let adShow = this.interstitiaAd.show();
            adShow && adShow.then(() => { console.log("插屏广告显示成功1") })
                .catch(() => {
                    adShow = this.interstitiaAd.show();
                    adShow && adShow.then(() => { console.log("插屏广告显示成功2") })
                        .catch(err => { console.log("插屏广告显示失败") });
                });

        });

        this.interstitiaAd.onError(err => {
            if (loadTimes < this.interstitiaLoadMaxTimes) {
                this.initInterstitia(loadTimes++);
            } else {
                console.log("插屏广告加载失败");
            }
        });

        this.interstitiaAd.onClose(() => {
            console.log("插屏广告关闭");
            this.interstitiaAd.offLoad();
            this.interstitiaAd.offError();
            this.interstitiaAd.offClose();
            this.interstitiaAd = null;
        });
    }

    showInterstitia() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        this.initInterstitia();
    }

    hideInterstitia() {
        if (!PlatformMg.Instance.onVivo) {
            return;
        }

        if (this.interstitiaAd) {
            this.interstitiaAd.close();
        }
    }

    //原生广告的父级
    fatherSpr: Laya.Sprite = null;
    //是否显示底部按钮
    showBottomBtn: boolean = false;
    closeCallBack: Function = null;

    //拉取的原生广告是否被展示
    nativeAdHadShow: boolean = true;
    //加载次数
    getTime = 0;

    initNativeAd(loadTimes: number = 1) {
        if (!PlatformMg.Instance.onVivo || !this.nativeAdHadShow) {
            return;
        }
        // this.showLog("initNativeAd loadTimes=" + loadTimes);
        if (this.nativeAd) {
            this.nativeAd.offLoad();
            this.nativeAd.offError();
            this.nativeAd = null;
        }

        this.nativeAd = qg.createNativeAd({
            posId: VivoAdUtil.VIVO_NATIVE_ID
        });

        Laya.timer.once(500, this, () => {
            this.nativeAd.load();
        });

        this.getTime = Laya.timer.currTimer;

        this.nativeAd.onLoad((res: any) => {
            console.log("原生广告加载成功");
            // this.showLog("原生广告加载成功");
            let list: any[] = res.adList;

            this.nativeList = [];
            for (let i = 0; i < list.length; i++) {
                let bean = list[i];
                let nativeBean = new VivoNativeAdBean();
                nativeBean.adId = bean.adId;
                nativeBean.clickBtnTxt = bean.clickBtnTxt;
                nativeBean.creativeType = bean.creativeType;
                nativeBean.desc = bean.desc;
                nativeBean.icon = bean.icon;
                nativeBean.imgUrlList = bean.imgUrlList;
                nativeBean.interactionType = bean.interactionType;
                nativeBean.logoUrl = bean.logoUrl;
                nativeBean.title = bean.title;

                this.nativeList.push(nativeBean);
            }
            this.nativeAdHadShow = false;

            if (this.fatherSpr) {
                this.creatNativeAd();
            }
        });

        this.nativeAd.onError(err => {
            if (loadTimes < this.interstitiaLoadMaxTimes) {
                loadTimes++;
                this.initNativeAd(loadTimes);
            } else {
                console.log("原生广告加载失败");
                // this.showLog("原生广告加载失败");

                if (this.nativeList && this.nativeList.length > 0 && this.fatherSpr) {
                    this.creatNativeAd();
                }
            }
        });
    }


    showNative(father_spr: Laya.Sprite, is_show = false, close_call_back: Function = null) {
        if (!PlatformMg.Instance.onVivo || !father_spr) {
            this.fatherSpr = null;
            return;
        }

        // this.showLog("showNative");

        // if (VivoADUtil.Instance.nativeList && VivoADUtil.Instance.nativeList.length > 0) {
        // this.creatNativeAd(father, showBtn);
        // }

        this.fatherSpr = father_spr;
        this.showBottomBtn = is_show;
        this.closeCallBack = close_call_back;
        this.initNativeAd();
    }

    creatNativeAd() {
        let dataBean = this.nativeList[0];
        let id = dataBean.adId;

        let adSpr: Laya.Sprite;
        Laya.loader.create("prefab/native_spr.json", Laya.Handler.create(this, (obj: Object) => {
            let prefab = new Laya.Prefab();
            prefab.json = obj;
            adSpr = Laya.Pool.getItemByCreateFun("carBox", prefab.create, prefab) as Laya.Sprite;
            this.fatherSpr.addChild(adSpr);

            let btn = adSpr.getChildByName("btn_spr") as Laya.Sprite;
            btn.visible = this.showBottomBtn;

            let ad_spr = adSpr.getChildByName("ad_spr") as Laya.Sprite;

            let native_spr = ad_spr.getChildByName("native_spr") as Laya.Sprite;
            native_spr.loadImage(dataBean.imgUrlList[0]);

            let close_spr = ad_spr.getChildByName("close_spr") as Laya.Sprite;
            close_spr.on(Laya.Event.CLICK, this, () => {
                adSpr.removeSelf();
                if (this.closeCallBack) this.closeCallBack();
            });

            let title_1 = ad_spr.getChildByName("title_1_lb") as Laya.Label;
            title_1.text = dataBean.title;

            let title_2 = ad_spr.getChildByName("title_2_lb") as Laya.Label;
            title_2.text = dataBean.desc;

            this.nativeAd.reportAdShow({ adId: id });
            this.nativeAdHadShow = true;

            native_spr.on(Laya.Event.CLICK, this, () => {
                this.nativeAd.reportAdClick({ adId: id });
            })

            btn.on(Laya.Event.CLICK, this, () => {
                this.nativeAd.reportAdClick({ adId: id });
            })
        }));
    }
}

export class VivoNativeAdBean {
    adId: string;
    title: string;
    desc: string;
    icon: string;
    imgUrlList: any[];
    logoUrl: string;
    clickBtnTxt: string;
    creativeType: number;
    interactionType: number;

    toString() {
        return "adId=" + this.adId +
            "\ntitle=" + this.title +
            "\ndesc=" + this.desc +
            "\nicon=" + this.icon +
            "\nlogoUrl=" + this.logoUrl +
            "\nclickBtnTxt=" + this.clickBtnTxt +
            "\ncreativeType=" + this.creativeType +
            "\ninteractionType=" + this.interactionType +
            "\nimgUrlList=" + this.imgUrlList;
    }
}
