export default class BaseSceneRt extends Laya.Scene {
    opened_call_back: Function;

    openedCallBack(callBack: Function) {
        this.opened_call_back = callBack;
    }

    onOpened(param: any) {
        console.log("BaseSceneRt----------------onOpened param=", param);
        this.opened_call_back && this.opened_call_back(param);
    }
}