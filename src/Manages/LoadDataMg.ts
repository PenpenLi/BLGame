import PlatformMg from "../Platform/PlatformMg";
import CoinMg from "./CoinMg";
import HttpMg from "./HttpMg";

export default class LoadDataMg {
    //初始化数据
    static init() {
        this.loadSubpackages().then(() => {
            //清除本地数据缓存
            // Laya.LocalStorage.clear();
            //登录操作
            HttpMg.login();
            //金币初始化
            CoinMg.Instance.init();


        });
    }

    static loadSubpackages(...packagePath: string[]) {
        return new Promise((resolve) => {
            if (packagePath && packagePath.length > 0 && PlatformMg.Instance.onWx) {
                let loadPro = 0;
                for (let i = 0; i < packagePath.length; i++) {
                    PlatformMg.Instance.platform.loadSubpackage({
                        name: packagePath[i],
                        success: () => {
                            loadPro++;
                            if (loadPro == packagePath.length) {
                                console.log("分包加载完毕");
                                resolve();
                            }
                        }
                    });
                }
            } else {
                console.log("不需要加载分包");
                resolve();
            }
        });
    }

    static loadSource() {
        
    }
}