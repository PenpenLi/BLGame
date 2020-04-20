import PlatformMg from "../Platform/PlatformMg";
import ConfigData from "../Data/ConfigData";
import HttpUtil from "../Utils/HttpUtil";
import LeadOutMg from "./LeadOutMg";

/**
 * 网络请求管理类
 */
export default class HttpMg {
    private static readonly MAX_GET_TIMES = 3;

    //请求次数
    private static getTimes: number = 0;

    /**
     * 登录请求
     */
    public static login() {
        if (PlatformMg.Instance.platform) {
            this.getTimes += 1;

            PlatformMg.Instance.platform.login({
                force: false,
                success: (res: any) => {
                    console.log("login success: res=", res);
                    if (res.code) {
                        ConfigData.Code = res.code;

                        let obj = PlatformMg.Instance.platform.getLaunchOptionsSync();
                        let appId = "0";
                        let scene = obj.scene;

                        if (obj.query == undefined || obj.query == null) {
                            scene = "0";
                        } else {
                            if (obj.query.scene == undefined || obj.query.scene == null) {
                                scene = "0";
                            } else {
                                scene = obj.query.scene;
                            }
                        }

                        ConfigData.Scene = decodeURIComponent(scene);

                        this.getTimes = 0;
                        let loginPath = Api.loginUrl
                            + "&version=" + ConfigData.VERSION
                            + "&code=" + res.code
                            + "&scene=" + ConfigData.Scene
                            + "&uid=" + appId;


                        this.loginToService(loginPath);

                    } else if (res.data) {
                        let token = res.token;
                        let obj = PlatformMg.Instance.platform.getLaunchOptionsSync();

                        let sence = "0";
                        if (obj.query == undefined || obj.query == null) {
                            sence = "0";
                        } else {
                            sence = JSON.stringify(obj.query);
                        }
                        this.loginOppoToService(token, sence);
                    }
                },
                fail: err => {
                    if (this.getTimes < this.MAX_GET_TIMES) {
                        this.login();
                    } else {
                        console.log("login fail");
                    }
                }
            })
        } else {
            console.log("请在微信开发工具上调试");
        }
    }

    /**
     * 登录自己后台
     */
    private static loginToService(loginPath: string) {
        console.log("loginPath=", loginPath);
        HttpUtil.request({
            url: loginPath,
            method: "get",
            complete: (res: any) => {
                console.log("loginToService success:", res);
                PlatformMg.Instance.setOpenID(res.data.openid, 0, 0);

                this.getGameList();
                this.getMisleadInfo();
            },
            error: (err: any) => {
                console.error("loginToService fail:", err);
            }
        });
    }

    /**
     * oppo 平台登录
     * @param token 
     * @param scene 
     */
    private static loginOppoToService(token: string, scene: any) {
        let path = "http://oppo.xyxapi.com/home/lxdd/index.php?act=userinfo&token=" + token + "&scene=" + scene;
        console.log("path:", path);
        HttpUtil.request({
            url: path,
            method: "get",
            complete: (res: any) => {
                console.log("loginOppoToService success:", res);
            },
            error: err => {
                console.log("loginOppoToService fail:", err);
            }
        });
    }

    /**
     * 加载导出列表
     */
    private static getGameList() {
        if (ConfigData.OpenId) {
            let path = Api.gameListUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    console.log("getLeadOut success:", res);
                    if (res.result_code == 1) {
                        LeadOutMg.GameList = res.data.gamelist;
                        LeadOutMg.BannerList = res.data.banner;

                        console.log("导出列表加载成功:");
                        console.log("GameList", LeadOutMg.GameList);
                        console.log("GameBannerList", LeadOutMg.BannerList);
                    }
                },
                error: err => {
                    console.log("导出列表加载失败:", err);
                }
            });
        }
    }

    /**
     * 游戏开始上传
     */
    public static startGame() {
        if (ConfigData.OpenId) {
            let path = Api.startGameUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    console.info("startGame success:", res);
                    ConfigData.GameId = res.data.id;
                },
                error: err => {
                    console.info("startGame fail:", err);
                }
            });
        }
    }

    //是否加载了ald代码
    isRequiered = true;
    public static endGame(level: string) {
        if (ConfigData.OpenId) {
            // if (!this.isRequiered) {
            //     // require("../ald/ald-game.js")
            //     this.isRequiered = true;
            // }

            let path = Api.endGameUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION + "&id=" + ConfigData.GameId + "&level=" + level;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    console.info("endGame success:", res);
                },
                error: err => {
                    console.info("endGame fail:", err);
                }
            });
        }
    }

    /**
     * 上传被点击的导出id
     * @param id 导出id
     */
    public static leadOut(id: string) {
        if (ConfigData.OpenId) {
            let path = Api.leadOutUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION + "&id=" + id;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    console.info("leadOut success:", res);
                },
                error: err => {
                    console.info("leadOut fail:", err);
                }
            });
        }
    }

    /**
     * 上传导出成功的id
     * @param id 导出id
     */
    public static leadOutSuccess(id: string) {
        if (ConfigData.OpenId) {
            let path = Api.leadOutSuccessUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION + "&id=" + id;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    console.info("leadOutSuccess success:", res);
                },
                error: err => {
                    console.info("leadOutSuccess fail:", err);
                }
            });
        }
    }

    /**
     * 是否误点
     */
    public static getMisleadInfo() {
        if (ConfigData.OpenId) {
            let path = Api.misleadUrl + "&openid=" + ConfigData.OpenId + "&version=" + ConfigData.VERSION + "&scene=" + ConfigData.Scene;
            HttpUtil.request({
                url: path,
                method: "get",
                complete: res => {
                    ConfigData.IsStatus = res.data.is_status == "1";
                    if (ConfigData.IsStatus) {
                        ConfigData.IsMisLead = res.data.casualClick == "1";
                    } else {
                        ConfigData.IsMisLead = false;
                    }

                    console.log("IsMisLead:", ConfigData.IsMisLead);
                    console.log("IsStatus:", ConfigData.IsStatus);
                },
                error: err => {
                    console.info("isMislead fail:", err);
                }
            });
        }
    }
}


export class Api {
    public static user: string = Api.getRootUrl() + "/index.php?act=user";//openid
    public static misleadUrl: string = Api.getRootUrl() + "/index.php?act=user";
    public static loginUrl: string = Api.getRootUrl() + "/index.php?act=userinfo";
    public static gameListUrl: string = Api.getRootUrl() + "/index.php?act=gamelist";
    public static startGameUrl: string = Api.getRootUrl() + "/index.php?act=index";
    public static endGameUrl: string = Api.getRootUrl() + "/index.php?act=end";
    public static leadOutUrl: string = Api.getRootUrl() + "/index.php?act=game";
    public static leadOutSuccessUrl: string = Api.getRootUrl() + "/index.php?act=cgame";
    public static leadBox: string = Api.getRootUrl() + "/index.php?act=hzlist";

    private static getRootUrl(): string {
        return "https://qdxyx.xyxapi.com/home/ssbxs";
    }
}

