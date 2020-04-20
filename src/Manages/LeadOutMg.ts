import TipsUtil from "../Utils/TipsUtil";
import AldMg from "./AldMg";
import HttpMg from "./HttpMg";
import PlatformMg from "../Platform/PlatformMg";
import TtAdUtil from "../Platform/TtAdUtil";

/**
 * 导出管理类
 */
export default class LeadOutMg {
    //导出游戏列表
    static GameList: any[];
    static BannerList: any[];

    /**
    * 获取导出列表长度
    */
    public static getGameListSize() {
        if (this.GameList == null) {
            return 0;
        } else {
            return this.GameList.length;
        }
    }

    public static checkBannerGameList(): boolean {
        if (this.BannerList == null || this.BannerList.length <= 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
    * 随机获取导出数组
    */
    public static getGameListRadom(num: number, list: any[]) {
        if (num == 0) {
            return null;
        }

        let ids = [];
        let newGameList = [];
        if (list != null && list.length > 0) {
            num = Math.min(num, list.length);

            let goon = true;
            while (goon) {
                let i = Number((Math.random() * (list.length - 1)).toFixed());
                if (ids.indexOf(i) < 0) {
                    ids.push(i);
                    newGameList.push(list[i]);
                }

                if (ids.length == num) {
                    goon = false;
                }
            }
            return newGameList;
        } else {
            return null;
        }
    }

    public static leadOut(gameInfo, dc_pois: string) {
        AldMg.upload(dc_pois);

        if (PlatformMg.Instance.onWx) {
            HttpMg.leadOut(gameInfo.id);
            PlatformMg.Instance.platform.navigateToMiniProgram({
                appId: gameInfo.appid,
                path: gameInfo.url,
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'release',
                success(res) {
                    // 确认导出
                    HttpMg.leadOutSuccess(gameInfo.id);
                },
                fail() {
                }
            });
        } else if (PlatformMg.Instance.onTt) {
            TtAdUtil.Instance.showMoreGames();
        } else {
            TipsUtil.msg("仅在微信中使用");
        }
    }
}