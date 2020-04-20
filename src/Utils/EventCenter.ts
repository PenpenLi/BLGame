export default class EventCenter {
    /** 监听数组 */
    private listeners = {};

    private listener_name = [];

    private static instance = null;

    public static getInstance(): EventCenter {
        if (!this.instance || this.instance == null) {
            this.instance = new EventCenter();
        }
        return this.instance;
    }
    /** 
     * 注册事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    public on(name: string, callback: Function, context: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) {
            this.listeners[name] = [];
        }
        this.listeners[name] = [];
        this.listeners[name].push(new Observer(callback, context));
    }

    /**
     * 移除事件
     * @param name 事件名称
     * @param callback 回调函数
     * @param context 上下文
     */
    public removeListener(name: string, context: any) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if (observers.length == 0) {
            delete this.listeners[name];
        }
    }


    /**
     * 移除所有事件
     */
    public removeAllListener() {
        this.listeners = {};
        console.log("event center clean all ", this.listeners);
    }

    /**
    * 移除所有事件
    */
    public removeTypeListener() {
        for (let i = 0; i < this.listener_name.length; i++) {
            delete this.listeners[this.listener_name[i]];
        }
    }

    /**
     * 发送事件
     * @param name 事件名称
     */
    public post(name: string, ...args: any[]) {
        let observers: Observer[] = this.listeners[name];
        if (!observers) return;

        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            observer.notify(...args);
        }
    }
}

export class Observer {
    /** 回调函数 */
    private callback: Function = null;
    /** 上下文 */
    private context: any = null;

    constructor(callback: Function, context: any) {
        let self = this;
        self.callback = callback;
        self.context = context;
    }

    /**
     * 发送通知
     * @param args 不定参数
     */
    notify(...args: any[]): void {
        let self = this;
        self.callback.call(self.context, ...args);
    }

    /**
     * 上下文比较
     * @param context 上下文
     */
    compar(context: any): boolean {
        return context == this.context;
    }
}

/**
 * 所有事件名称定义在这
 * 命名规则：类名+事件名（下划线分割）
 * 示例：DemoSpr_ActionName
 */
export class EventName {
    static CoinBox_RefreshCoin = "CoinBox_RefreshCoin";
}