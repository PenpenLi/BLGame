export default class ViewUtil {
    /**
     * 动画 放大缩小  放大
     * @param view 
     */
    static setScaleAni(view: Laya.Sprite) {
        Laya.Tween.to(view, { scaleX: 1.1, scaleY: 1.1 }, 500, null, Laya.Handler.create(this, () => {
            this.setScaleAni2(view);
        }));
    }

    /**
     * 动画 放大缩小  缩小
     * @param view 
     */
    private static setScaleAni2(view: Laya.Sprite) {
        Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, () => {
            this.setScaleAni(view);
        }));
    }
}