export default class WindowUtil {
    /**
     * 屏幕适配
     */

    //场景size
    public static gameWidth = 750;
    public static gameHeight = 1334;

    //屏幕适配Y轴偏移量
    public static offY = 0;

    public static isIphoneX: boolean = false;
    public static clientScale = 1;
    public static heightOffsetScale = 0;

    public static init() {
        this.gameHeight = 750 * Laya.Browser.clientHeight / Laya.Browser.clientWidth;
        this.clientScale = this.gameHeight / Laya.Browser.clientHeight;
        this.heightOffsetScale = (this.gameHeight - 1334) / (1624 - 1334);

        if (this.gameHeight - 1334 > 0) {
            this.offY = (this.gameHeight - 1334) / 2;
        }

        this.isIphoneX = Laya.Browser.clientHeight / Laya.Browser.clientWidth > 2;

        console.log("WindowUtil Laya.Browser.client:", Laya.Browser.clientWidth, Laya.Browser.clientHeight);
        console.log("WindowUtil Laya.stageSize:", Laya.stage.width, Laya.stage.height);
        console.log("WindowUtil IsIphoneX=", this.isIphoneX);
        console.log("WindowUtil gameWidth=" + this.gameWidth, "  gameHeight=" + this.gameHeight);
        console.log("WindowUtil clientScale=", this.clientScale);
        console.log("WindowUtil heightOffsetScale=", this.heightOffsetScale);
        console.log("WindowUtil offY=", this.offY);
    }

    /**
     * 物体跟随
     * @param followed_spr_1 :被跟随组件
     * @param follow_spr_2 ：跟随组件
     * @param off_position ：差值
     * @param rate ：插值 0~1
     */
    public static follow2(followed_spr_1: Laya.Sprite3D, follow_spr_2: Laya.Sprite3D, off_position: Laya.Vector3, rate: number = 1) {
        let add_v3 = new Laya.Vector3();
        Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);

        let camare_off_rate_v3 = new Laya.Vector3();
        Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
        follow_spr_2.transform.position = camare_off_rate_v3;
    }

    public static follow2Z(followed_spr_1: Laya.Sprite3D, follow_spr_2: Laya.Sprite3D, off_position: Laya.Vector3, rate: number = 1) {
        let add_v3 = new Laya.Vector3();
        Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);

        let camare_off_rate_v3 = new Laya.Vector3();
        Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
        follow_spr_2.transform.localPositionZ = camare_off_rate_v3.z;
    }
}