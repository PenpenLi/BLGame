import WindowUtil from "../../Utils/WindowUtil";
import LeadOutMg from "../../Manages/LeadOutMg";

export default class BannerDefaultSprite extends Laya.Sprite {
    load_id = 0;
    type: number = 1;
    constructor(type: number) {
        super();
        this.type = type;
        this.name = "leadOut5Spr";
    }

    onEnable() {
        if (LeadOutMg.checkBannerGameList()) {
            this.initSize();
            this.load_id = Math.floor(Math.random() * LeadOutMg.BannerList.length);
            this.loadImage(LeadOutMg.BannerList[this.load_id].img);
            Laya.timer.loop(5000, this, () => {
                this.load_id++;
                this.load_id = this.load_id % LeadOutMg.BannerList.length;
                this.loadImage(LeadOutMg.BannerList[this.load_id].img);
            })

            this.on(Laya.Event.CLICK, this, () => {
                LeadOutMg.leadOut(LeadOutMg.BannerList[this.load_id], "LeadOut5RunTime");
            })
        } else {
            this.visible = false;
            console.log("bannerlist is empty 隐藏广告位导出");
        }
    }

    initSize() {
        if (this.type == 1) {
            this.height = 234;
            this.width = 750;
        } else {
            this.height = 200;
            this.width = 600;
        }

        this.x = (WindowUtil.gameWidth - this.width) / 2;
        this.y = WindowUtil.gameHeight - this.height;

        if (WindowUtil.isIphoneX) {
            this.y -= 30;
        }
    }
}