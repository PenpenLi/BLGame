import PlatformMg from "./PlatformMg";

export default class TtAdUtil {
    private static _instance: TtAdUtil;
    public static get Instance(): TtAdUtil {
        if (!this._instance) {
            this._instance = new TtAdUtil();
        }
        return this._instance;
    }

    private MAX_TIME = 2;
    private shareId = "cbhrendgpm532970gb";
    private bannerId = "424h081ij6aa1a3da2";
    private videoId = "4ahb7em004cm1riaae";
    private game_key = "tte34895f57c628a08";

    private options;

    private bannerAd;
    private videoAd;

    private isShowBanner = false;

    private videoPath: string = "";

    init() { }

    initBanner(time = 0) {
        console.log("TtAdUtil showBanner", time);

        if (this.bannerAd) {
            this.bannerAd.destroy();
        }

        //没有初始化
        let InfoSync = PlatformMg.Instance.platform.getSystemInfoSync();
        let windowWidth = InfoSync.windowWidth;
        let windowHeight = InfoSync.windowHeight;
        let targetBannerAdWidth = 208;
        let top = windowHeight - (targetBannerAdWidth / 16) * 9;
        let left = (windowWidth - targetBannerAdWidth) / 2;
        // 创建一个居于屏幕底部正中的广告
        this.bannerAd = PlatformMg.Instance.platform.createBannerAd({
            adUnitId: this.bannerId,
            style: {
                width: targetBannerAdWidth,
                top: top,
                left: left
            }
        });

        this.bannerAd.onLoad(() => {
            if (this.isShowBanner) {
                this.bannerAd.show().then(() => {
                    console.log("tt banner 显示成功");
                    this.refreshBanner();
                }).catch(err => {
                    console.log("tt banner 组件出现问题", err);
                    this.refreshBanner();
                });
            }
        });

        this.bannerAd.onError(() => {
            if (time < this.MAX_TIME) {
                time++;
                this.initBanner(time);
            } else {
                console.log("tt banner init fail");
            }
        });

        this.bannerAd.onResize(size => {
            this.bannerAd.style.top = windowHeight - size.height;
            this.bannerAd.style.left = (windowWidth - size.width) / 2;
        });

    }

    refreshBanner() {
        Laya.timer.clearAll(this);
        Laya.timer.once(20 * 1000, this, () => {
            this.initBanner();
        });
    }

    showBanner(data: any = {}) {
        this.isShowBanner = true;
        if (this.bannerAd) {
            this.bannerAd.show().then(() => {
                console.log("tt banner 显示成功");
                this.refreshBanner();
            }).catch(err => {
                this.refreshBanner();
                console.log("tt banner 组件出现问题", err);
            });
        } else {
            this.initBanner();
        }
    }

    hideBanner() {
        console.log("TtAdUtil hideBanner");
        Laya.timer.clearAll(this);

        this.isShowBanner = false;

        if (this.bannerAd) {
            this.bannerAd.hide();
        }
    }

    video(opt: any = {}, time = 0) {
        console.log("TtAdUtil showVideo :", time);
        this.options = opt;
        if (!this.videoId) {
            console.log("TtAdUtil showVideo videoId=null");
            if (this.options) {
                this.options.fail && this.options.fail();
            }
            return;
        }

        if (!this.videoAd) {
            console.log("TtAdUtil showVideo :重新请求");
            // 重新拉取视频广告
            this.videoAd = PlatformMg.Instance.platform.createRewardedVideoAd({
                adUnitId: this.videoId
            });

            this.videoAd.load().then(() => {
                this.videoAd.show()
                    .then(() => { console.log("tt video 显示成功"); })
                    .catch(err => {
                        if (time < this.MAX_TIME) {
                            time++;
                            this.video(this.options, time);
                        } else {
                            console.log("tt video 显示失败:", err);
                            this.share(this.options);
                        }
                    });
            }).catch(err => {
                if (time < this.MAX_TIME) {
                    time++;
                    this.video(this.options, time);
                } else {
                    console.log("tt video 显示失败:", err);
                    this.share(this.options);
                }
            });

            this.videoAd.onClose(res => {
                console.log("video close  isEnded=", res.isEnded);
                if (res.isEnded) {
                    if (this.options) {
                        this.options.success && this.options.success();
                    }
                } else {
                    if (this.options) {
                        this.options.fail && this.options.fail();
                    }
                }
            });
        } else {
            console.log("TtAdUtil showVideo :直接显示");
            this.videoAd.show().then(() => {
                console.log("tt video 显示成功");
            }).catch(err => {
                if (time < this.MAX_TIME) {
                    time++;
                    this.video(this.options, time);
                } else {
                    console.log("tt video 显示失败:", err);
                    this.share(this.options);
                }
            });
        }
    }

    startScreencap() {
        console.log("startScreencap");
        PlatformMg.Instance.platform.getGameRecorderManager().onStart(
            (res) => {
                console.log("录屏开始")
            });
        PlatformMg.Instance.platform.getGameRecorderManager().start({ duration: 60 });
    }

    stopScreencap() {
        console.log("stopScreencap");

        PlatformMg.Instance.platform.getGameRecorderManager().onStop(res => {
            this.videoPath = res.videoPath// 录屏文件路径，分享时用这个
            console.log('视频录制地址:', res, res.videoPath)
        });
        PlatformMg.Instance.platform.getGameRecorderManager().stop();
    }

    share(opt: any) {
        let videoId: string;
        console.log("videoPath:", this.videoPath);

        this.options = opt;
        PlatformMg.Instance.platform.shareAppMessage({
            channel: "video",
            title: "刺激赛道,根本停不下来!",
            desc: "车门已经焊死，谁都别想下车！",
            imageUrl: "images/share.png",
            templateId: this.shareId, // 替换成通过审核的分享ID
            query: "",
            extra: {
                videoPath: this.videoPath, // 可替换成录屏得到的视频地址
                videoTopics: ["#摩托车王者赛"],
                withVideoId: true
            },
            success(res) {
                videoId = res.videoId;
                if (this.options) {
                    this.options.success && this.options.success();
                }
            },
            fail(e) {
                if (this.options) {
                    this.options.fail && this.options.fail();
                }
            }
        })

        PlatformMg.Instance.platform.navigateToVideoView({
            videoId: videoId,
            success: res => {
                console.log("done");
            },
            fail: err => {
                if (err.errCode === 1006) {
                    PlatformMg.Instance.platform.showToast({
                        title: "something wrong with your network"
                    });
                }
            }
        });
    }

    appLaunchOptions: any[];
    showMoreGames() {
        console.log("showMoreGames");
        const systemInfo = PlatformMg.Instance.platform.getSystemInfoSync();
        // iOS 不支持，建议先检测再使用
        if (systemInfo.platform !== "ios") {
            PlatformMg.Instance.platform.showMoreGamesModal({
                appLaunchOptions: this.appLaunchOptions,
                success(res) {
                    this.onShow();
                },
                fail(res) {
                }
            });
        }
    }

    /**监听跳转游戏 */
    onShow() {
        console.log("onShow");
        PlatformMg.Instance.platform.onNavigateToMiniProgram(function (res) {
            switch (res.errCode) {
                case 0://跳转成功
                    // GameHttp.Instance.leadOutSuccess("999");
                    break;
                case 1://跳转失败
                    break;

                case 2://用户取消
                    break;
                default:
                    break;
            }
            this.offShow();
        });
    }

    /**取消监听跳转游戏 
     * @param callback 取消指定回调函数 callback 不填取消全部回调函数
    */
    offShow(callback?: Function) {
        PlatformMg.Instance.platform.offNavigateToMiniProgram(callback);
    }

    /**监听关闭更多游戏弹窗 */
    onMoreBtnClose(callback: Function) {
        PlatformMg.Instance.platform.onMoreGamesModalClose(callback)
    }

    /**取消监听关闭更多游戏弹窗
     * @param callback 取消指定回调函数 callback 不填取消全部回调函数
     */
    offMoreBtnClose(callback?: Function) {
        PlatformMg.Instance.platform.offMoreGamesModalClose(callback)
    }

    Action_sy_btn = "sy_btn";
    Action_share_btn = "share_btn";
    Action_relive_btn = "relive_btn";
    Action_start_btn = "start_btn";
    Action_end_lq = "end_lq";
    Action_end_share = "end_share";

    upLoadAction(action_type: string, ) {
        console.log("upLoadAction", action_type);
        if (PlatformMg.Instance.onTt) {
            PlatformMg.Instance.platform.reportAnalytics(action_type, {});
        }
    }
}