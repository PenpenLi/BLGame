import ConfigData from "../Data/ConfigData";
import WindowUtil from "../Utils/WindowUtil";

export default class PlatformMg {
    private static instance: PlatformMg;
    static get Instance() {
        if (!PlatformMg.instance) {
            PlatformMg.instance = new PlatformMg();
        }
        return PlatformMg.instance;
    }

    readonly Wx = "Wx";
    readonly Qq = "Qq";
    readonly Tt = "tt";
    readonly Vivo = "Vivo";
    readonly Oppo = "Oppo";
    readonly Bd = "Bd";

    onWx: boolean = false;
    onQq: boolean = false;
    onTt: boolean = false;
    onVivo: boolean = false;
    onOppo: boolean = false;
    onBd: boolean = false;

    isWx: boolean = false;
    isQq: boolean = false;
    isTt: boolean = false;
    isVivo: boolean = false;
    isOppo: boolean = false;
    isBd: boolean = false;

    //平台名称
    platformName = this.Wx;
    //平台实例
    platform: any;
    //开放域(Wx用)
    openDataViewer: Laya.WXOpenDataViewer;

    init() {
        switch (this.platformName) {
            case this.Wx:
                this.isWx = true;
                this.initWx();
                break;
            case this.Qq:
                this.isQq = true;
                this.initQq();
                break;
            case this.Oppo:
                this.isOppo = true;
                this.initOppo();
                break;
            case this.Vivo:
                this.isVivo = true;
                this.initVivo();
                break;
            case this.Tt:
                this.isTt = true;
                this.initTt();
                break;
            default:
                break;
        }
    }

    private initWx() {
        this.platform = Laya.Browser.window.Wx;
        this.onWx = this.platform;

        if (this.onWx) {
            this.platform.onShow(() => { });
            //开放域组件
            this.openDataViewer = new Laya.WXOpenDataViewer();
        }
    }

    private initTt() {
        this.platform = Laya.Browser.window.wx;
        this.onTt = this.platform;
    }

    private initQq() {
        this.platform = Laya.Browser.window.Qq;
        this.onQq = this.platform;

        if (this.onQq) {
            this.platform.onShow(() => {
            });
        }
    }

    private initOppo() {
        this.platform = Laya.Browser.window.qg;
        this.onOppo = this.platform;

        if (this.onOppo) {
            this.platform.setEnableDebug({
                enableDebug: false
            });
        }
    }

    private initVivo() {
        // StaticData.isMisLead = true;
        this.platform = Laya.Browser.window.qg;
        this.onVivo = this.platform;

    }

    getJlInfo() {
        if (this.platform)
            return this.platform.getMenuButtonBoundingClientRect();
        else
            return null;
    }

    topMidle(view: Laya.Sprite) {
        if (view == null) {
            return;
        }

        try {
            let data = this.platform.getMenuButtonBoundingClientRect();
            let off = (data.height * WindowUtil.clientScale - view.height) / 2;
            view.y = data.top * WindowUtil.clientScale + off;
        } catch (error) {
            view.y = 20;
        }
    }

    top(view: Laya.Sprite) {
        if (view == null) {
            return;
        }

        if (this.platform) {
            let data = this.platform.getMenuButtonBoundingClientRect();
            if (data) {
                view.y = data.top * WindowUtil.clientScale;
            } else {
                view.y = 20;
            }
        } else {
            view.y = 20;
        }
    }

    wxCopy() {
        if (this.platformName == this.Wx && Laya.Browser.onWeiXin) {
            let copyTxt = ["$6VWIYtQ9ny4$",
                "$gXXNYtQ9Zks$",
                "$0qWPYtQk0YB$",
                "$Bo20YtQkqvP$",
                "$PEnfYtQkYPc$",
                "$WyJPYtQPfJw$",
                "$MuIaYtQPUQ4$",
                "$VuVFYtQPcpB$",
                "$pujuYtQPrFd$",
                "$eC5MYtQlak1$"];

            this.platform.setClipboardData({
                data: copyTxt[Math.floor(Math.random() * (copyTxt.length - 1))], success: () => {
                    this.platform.hideToast();
                }
            });
        }
    }

    /**
     * 短震动
     */
    shortVibrate() {
        if (this.onWx) {
            this.platform.vibrateShort();
        }
    }

    /**
     * 长震动
     */
    longVibrate() {
        if (this.onWx) {
            this.platform.vibrateLong();
        }
    }

    setOpenID(id: string, score, level) {
        ConfigData.OpenId = id;
        if (this.onWx && ConfigData.OpenId) {
            let open = this.openDataViewer;
            let data = { command: "user", openid: ConfigData.OpenId, score: score, station_name: "第" + level + "关" }
            open.postMsg(data);
            // console.log("开放域：", data);
        }
    }
}