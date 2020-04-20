export default class BaseDialogRt extends Laya.Dialog {
    opened_call_back: Function;

    openedCallBack(callBack: Function) {
        this.opened_call_back = callBack;
    }

    onOpened(param: any) {
        console.log("BaseDialogRt----------------onOpened param=", param);
        this.opened_call_back && this.opened_call_back(param);
    }
}