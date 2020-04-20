import PlatformMg from "../Platform/PlatformMg";
import BaseSceneRt from "./BaseSceneRt";
import AldMg from "../Manages/AldMg";
import CoinMg from "../Manages/CoinMg";

export default abstract class BaseScene extends Laya.Script {
    owner: BaseSceneRt;

    //阿拉丁页面统计字段,自动获取页面路径
    aldPage: string = "BaseDialog";

    abstract initData();//初始化数据
    abstract findView();//获得组件
    abstract initView();//初始化组件
    abstract screenAdaptation();//屏幕适配
    abstract onClick();//点击事件

    onEnable() {
        console.log(this.owner.url, "------------------onEnable");
        this.aldPage = this.owner.url.substring(this.owner.url.lastIndexOf("/"), this.owner.url.lastIndexOf(".scene"));
        //数据初始化
        this.initData();
        //获取组件
        this.findView();
        //初始化组件
        this.initView();
        //屏幕适配
        this.screenAdaptation();
    }

    onStart() {
        console.log(this.owner.url, "------------------onStart");
        AldMg.upload(this.aldPage);
    }


    onDisable() {
        console.log(this.owner.url, "------------------onDisable");
        // 组件被禁用时，隐藏banner,清除定时器
        Laya.timer.clearAll(this.owner);
        Laya.Tween.clearAll(this.owner);
    }

    onDestroy() {
        console.log(this.owner.url, "------------------onDestroy");
    }

    showBanner() {
    }

    hideBanner() {
    }

    //设置是否开启误点
    setIsShowMisLead(isShow, view) {
        let oldY;
        if (isShow) {
            view.visible = true;
            oldY = view.y;

            try {
                Laya.timer.clearAll(this);
                Laya.timer.once(1500, this, () => {
                    // ADUtil.Instance.showBannerAd(1, this.owner);
                    Laya.Tween.to(view, { "y": oldY }, 300, null, null, 200);
                })
            } catch (error) { }
        } else {
            // ADUtil.Instance.showBannerAd(1, this.owner);
            view.visible = false;
            view.alpha = 0.3;
            Laya.timer.once(1000, this, function () {
                view.visible = true;
            });
        }
    }

    /**
     * 播放dialog 内的帧动画
     * @param name 动画名称
     * @param isLoop 是否循环
     */
    startAni(name: string, isLoop: boolean) {
        let ani = this.owner[name] as Laya.Animation;
        if (ani) {
            ani.play(null, isLoop);
        }
    }


    /**
     * 刷新金币
     * coinBox为预制体，布局的时候放在根目录
     */
    refreshCoin() {
        let coinBox = this.owner.getChildByName("coinBox") as Laya.Box;
        if (coinBox) {
            //金币布局与微信胶囊按钮对齐
            PlatformMg.Instance.topMidle(coinBox);

            let coinLb: Laya.Label = coinBox.getChildByName("coinLb") as Laya.Label;
            let coinNum = CoinMg.Instance.getCoin();
            if (coinLb != null) {
                if (coinNum >= 10000) {
                    coinLb.text = (coinNum / 1000).toFixed(1) + "k";
                } else {
                    coinLb.text = String(coinNum);
                }
            }
        }
    }
}