(function () {
    'use strict';

    class BaseDialogRt extends Laya.Dialog {
        openedCallBack(callBack) {
            this.opened_call_back = callBack;
        }
        onOpened(param) {
            console.log("BaseDialogRt----------------onOpened param=", param);
            this.opened_call_back && this.opened_call_back(param);
        }
    }

    class ConfigData {
    }
    ConfigData.GAME_NAME = "game_name";
    ConfigData.VERSION = 100;
    ConfigData.GameId = "";
    ConfigData.Scene = "0";
    ConfigData.Code = "";
    ConfigData.OpenId = "";
    ConfigData.IsMisLead = false;
    ConfigData.IsStatus = false;
    class LocalStorageKey {
    }
    LocalStorageKey.COIN = "COIN";

    class WindowUtil {
        static init() {
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
        static follow2(followed_spr_1, follow_spr_2, off_position, rate = 1) {
            let add_v3 = new Laya.Vector3();
            Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);
            let camare_off_rate_v3 = new Laya.Vector3();
            Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
            follow_spr_2.transform.position = camare_off_rate_v3;
        }
        static follow2Z(followed_spr_1, follow_spr_2, off_position, rate = 1) {
            let add_v3 = new Laya.Vector3();
            Laya.Vector3.add(followed_spr_1.transform.position, off_position, add_v3);
            let camare_off_rate_v3 = new Laya.Vector3();
            Laya.Vector3.lerp(follow_spr_2.transform.position, add_v3, rate, camare_off_rate_v3);
            follow_spr_2.transform.localPositionZ = camare_off_rate_v3.z;
        }
    }
    WindowUtil.gameWidth = 750;
    WindowUtil.gameHeight = 1334;
    WindowUtil.offY = 0;
    WindowUtil.isIphoneX = false;
    WindowUtil.clientScale = 1;
    WindowUtil.heightOffsetScale = 0;

    class PlatformMg {
        constructor() {
            this.Wx = "Wx";
            this.Qq = "Qq";
            this.Tt = "tt";
            this.Vivo = "Vivo";
            this.Oppo = "Oppo";
            this.Bd = "Bd";
            this.onWx = false;
            this.onQq = false;
            this.onTt = false;
            this.onVivo = false;
            this.onOppo = false;
            this.onBd = false;
            this.isWx = false;
            this.isQq = false;
            this.isTt = false;
            this.isVivo = false;
            this.isOppo = false;
            this.isBd = false;
            this.platformName = this.Wx;
        }
        static get Instance() {
            if (!PlatformMg.instance) {
                PlatformMg.instance = new PlatformMg();
            }
            return PlatformMg.instance;
        }
        init() {
            switch (this.platformName) {
                case this.Wx:
                    this.isWx = true;
                    this.initWx();
                    break;
                case this.Qq:
                    this.isQq = true;
                    this.initQq();
                    break;
                case this.Oppo:
                    this.isOppo = true;
                    this.initOppo();
                    break;
                case this.Vivo:
                    this.isVivo = true;
                    this.initVivo();
                    break;
                case this.Tt:
                    this.isTt = true;
                    this.initTt();
                    break;
                default:
                    break;
            }
        }
        initWx() {
            this.platform = Laya.Browser.window.Wx;
            this.onWx = this.platform;
            if (this.onWx) {
                this.platform.onShow(() => { });
                this.openDataViewer = new Laya.WXOpenDataViewer();
            }
        }
        initTt() {
            this.platform = Laya.Browser.window.wx;
            this.onTt = this.platform;
        }
        initQq() {
            this.platform = Laya.Browser.window.Qq;
            this.onQq = this.platform;
            if (this.onQq) {
                this.platform.onShow(() => {
                });
            }
        }
        initOppo() {
            this.platform = Laya.Browser.window.qg;
            this.onOppo = this.platform;
            if (this.onOppo) {
                this.platform.setEnableDebug({
                    enableDebug: false
                });
            }
        }
        initVivo() {
            this.platform = Laya.Browser.window.qg;
            this.onVivo = this.platform;
        }
        getJlInfo() {
            if (this.platform)
                return this.platform.getMenuButtonBoundingClientRect();
            else
                return null;
        }
        topMidle(view) {
            if (view == null) {
                return;
            }
            try {
                let data = this.platform.getMenuButtonBoundingClientRect();
                let off = (data.height * WindowUtil.clientScale - view.height) / 2;
                view.y = data.top * WindowUtil.clientScale + off;
            }
            catch (error) {
                view.y = 20;
            }
        }
        top(view) {
            if (view == null) {
                return;
            }
            if (this.platform) {
                let data = this.platform.getMenuButtonBoundingClientRect();
                if (data) {
                    view.y = data.top * WindowUtil.clientScale;
                }
                else {
                    view.y = 20;
                }
            }
            else {
                view.y = 20;
            }
        }
        wxCopy() {
            if (this.platformName == this.Wx && Laya.Browser.onWeiXin) {
                let copyTxt = ["$6VWIYtQ9ny4$",
                    "$gXXNYtQ9Zks$",
                    "$0qWPYtQk0YB$",
                    "$Bo20YtQkqvP$",
                    "$PEnfYtQkYPc$",
                    "$WyJPYtQPfJw$",
                    "$MuIaYtQPUQ4$",
                    "$VuVFYtQPcpB$",
                    "$pujuYtQPrFd$",
                    "$eC5MYtQlak1$"];
                this.platform.setClipboardData({
                    data: copyTxt[Math.floor(Math.random() * (copyTxt.length - 1))], success: () => {
                        this.platform.hideToast();
                    }
                });
            }
        }
        shortVibrate() {
            if (this.onWx) {
                this.platform.vibrateShort();
            }
        }
        longVibrate() {
            if (this.onWx) {
                this.platform.vibrateLong();
            }
        }
        setOpenID(id, score, level) {
            ConfigData.OpenId = id;
            if (this.onWx && ConfigData.OpenId) {
                let open = this.openDataViewer;
                let data = { command: "user", openid: ConfigData.OpenId, score: score, station_name: "第" + level + "关" };
                open.postMsg(data);
            }
        }
    }

    class AldMg {
        static onStart(id, name, user_id) {
            if (!this.postAld) {
                return;
            }
            let obj = {
                "stageId": id,
                "stageName": name,
                "userId": user_id
            };
            if (PlatformMg.Instance.platform) {
                try {
                    PlatformMg.Instance.platform.aldStage.onStart(obj);
                }
                catch (error) {
                    console.error("stageStart upload fail");
                }
            }
        }
        static onRunning(id, name, user_id) {
            if (!this.postAld) {
                return;
            }
            let obj = {
                "stageId": id,
                "stageName": name,
                "userId": user_id,
                "event": "relive"
            };
            if (PlatformMg.Instance.platform) {
                try {
                    PlatformMg.Instance.platform.aldStage.onRunning(obj);
                }
                catch (error) {
                    console.error("onRunning upload fail");
                }
            }
        }
        static onEnd(id, name, user_id, event) {
            if (!this.postAld) {
                return;
            }
            let obj = {
                "stageId": id,
                "stageName": name,
                "userId": user_id,
                "event": event ? "complete" : "fail"
            };
            if (PlatformMg.Instance.platform) {
                try {
                    PlatformMg.Instance.platform.aldStage.onEnd(obj);
                }
                catch (error) {
                    console.error("onRunning upload fail");
                }
            }
        }
        static upload(obj) {
            if (!this.postAld) {
                return;
            }
            if (PlatformMg.Instance.platform) {
                try {
                    PlatformMg.Instance.platform.aldSendEvent(obj);
                }
                catch (error) {
                }
            }
        }
    }
    AldMg.postAld = true;

    class LocalStorageUtil {
        static remove(key) {
            if (key == null || key == "") {
                console.error(this.name + "---> remove err : key undefind");
                return;
            }
            Laya.LocalStorage.removeItem(LocalStorageUtil.rootPath + key);
        }
        static setString(key, value) {
            if (value == null || key == null || key == "") {
                console.error(this.name + "---> setString err : key or value undefind");
                return;
            }
            Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value);
        }
        static setNumber(key, value) {
            if (value == null || key == null || key == "") {
                console.error(this.name + "---> setNumber err : key or value undefind");
                return;
            }
            Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, String(value));
        }
        static setBoolean(key, value) {
            if (value == null || key == null || key == "") {
                console.error(this.name + "---> setBoolean err : key or value undefind");
                return;
            }
            Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value ? "1" : "0");
        }
        static setList(key, value) {
            if (value == null || key == null || key == "") {
                console.error(this.name + "---> setList err : key or value undefind");
                return;
            }
            console.log("存储数组：", value);
            Laya.LocalStorage.setJSON(LocalStorageUtil.rootPath + key, value);
        }
        static getString(key, def_value) {
            if (key == null || key == "") {
                console.error(this.name + "---> getString err : key undefind");
                return;
            }
            let string = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
            if (string) {
                return string;
            }
            else {
                if (def_value) {
                    return def_value;
                }
                else {
                    return null;
                }
            }
        }
        static getNumber(key, def_value) {
            if (key == null || key == "") {
                console.error(this.name + "---> getNumber err : key undefind");
                return;
            }
            let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
            if (!val || val == "" || val == "0") {
                if (def_value != null || def_value != undefined) {
                    return def_value;
                }
                else {
                    return 0;
                }
            }
            else {
                return Number(val);
            }
        }
        static getBoolean(key, def_value) {
            if (key == null || key == "") {
                console.error(this.name + "---> getBoolean err : key undefind");
                return;
            }
            let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
            if (!val || val == "") {
                if (def_value != null)
                    return def_value;
                else
                    return false;
            }
            else {
                return val == "1";
            }
        }
        static getList(key, def_value) {
            if (key == null || key == "") {
                console.error("getList err : key undefind");
                return;
            }
            let list = Laya.LocalStorage.getJSON(LocalStorageUtil.rootPath + key);
            if (!list) {
                if (def_value) {
                    return def_value;
                }
                else {
                    return null;
                }
            }
            else {
                console.log("取出数组：", list);
                return list;
            }
        }
    }
    LocalStorageUtil.rootPath = ConfigData.GAME_NAME + "_";

    function array_uniq(array) {
        var temp = [];
        var index = [];
        var l = array.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                if (array[i] === array[j]) {
                    i++;
                    j = i;
                }
            }
            temp.push(array[i]);
            index.push(i);
        }
        return temp;
    }
    const isJsonStr = (str) => {
        if (typeof str === "string") {
            try {
                let obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        }
        else {
            return false;
        }
    };
    const roundRectPath = (x, y, w, h, r) => {
        return [
            ["moveTo", x + r, 0],
            ["lineTo", x + w - r, 0],
            ["arcTo", x + w, y, x + w, y + r, r],
            ["lineTo", x + w, y + h - r],
            ["arcTo", x + w, y + h, x + w - r, y + h, r],
            ["lineTo", x + r, y + h],
            ["arcTo", x, y + h, x, y + h - r, r],
            ["lineTo", x, y + r],
            ["arcTo", x, y, x + r, y, r],
            ["closePath"]
        ];
    };
    const formatDate = (date = null) => {
        if (date === null)
            date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    };
    const add3dTo2d = (father, meshSpr, x, y) => {
        var scene = new Laya.Scene3D();
        father.addChild(scene);
        var camera = new Laya.Camera(1, 1, 1000);
        scene.addChild(camera);
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), false, false);
        camera.orthographic = true;
        camera.orthographicVerticalSize = 1;
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        var directionLight = new Laya.DirectionLight();
        scene.addChild(directionLight);
        directionLight.intensity = 1;
        directionLight.color = new Laya.Vector3(1, 0.96, 0.84);
        directionLight.transform.rotate(new Laya.Vector3(-45, 0, 0));
        let pos = new Laya.Vector3(x, y, 0);
        let _translate = new Laya.Vector3(0, 0, 0);
        scene.addChild(meshSpr);
        camera.convertScreenCoordToOrthographicCoord(pos, _translate);
        meshSpr.transform.position = _translate;
        meshSpr.transform.rotationEuler = new Laya.Vector3(0, 45, 0);
    };
    const hex_to_ten = (hex) => {
        let decimalValue = 0;
        for (let i = 0; i < hex.length; i++) {
            let hexChar = hex.charAt(i);
            decimalValue = decimalValue * 16 + hexCharToDecimal(hexChar);
        }
        return decimalValue;
    };
    const hexCharToDecimal = (char) => {
        let asc_a = "a".charCodeAt(0);
        let asc_f = "f".charCodeAt(0);
        let asc_A = "A".charCodeAt(0);
        let asc_F = "F".charCodeAt(0);
        let asc_0 = "0".charCodeAt(0);
        let asc_9 = "9".charCodeAt(0);
        let asc_char = char.charCodeAt(0);
        if (asc_char >= asc_a && asc_char <= asc_f) {
            return 10 + asc_char - asc_a;
        }
        else if (asc_char >= asc_A && asc_char <= asc_F) {
            return 10 + asc_char - asc_A;
        }
        else if (asc_char >= asc_0 && asc_char <= asc_9) {
            return asc_char - asc_0;
        }
        else {
            throw Error("转换时字符错误：" + char);
        }
    };

    class TipsUtil {
        constructor() {
            if (!TipsUtil.root) {
                TipsUtil.root = Laya.stage.addChild(new Laya.Sprite());
                TipsUtil.root.zOrder = 1001;
            }
        }
        static alert(content, options = {}, yes = null) { }
        static msg(content, time = 1500, isCenter = true, end = null) {
            let box = this.root.addChild(new Laya.Box());
            let bg = box.addChild(new Laya.Sprite());
            let txt = box.addChild(new Laya.Label());
            txt.text = content;
            txt.font = "SimHei";
            txt.color = "#ffffff";
            txt.padding = "15,15,15,15";
            txt.fontSize = 30;
            box.width = bg.width = txt.width;
            box.height = bg.height = txt.height;
            bg.graphics.drawPath(0, 0, roundRectPath(0, 0, txt.width, txt.height, 10), { fillStyle: "#000000" });
            bg.alpha = 1;
            box.x = (Laya.stage.width - box.width) / 2;
            if (isCenter) {
                box.y = (Laya.stage.height - box.height) / 2;
            }
            else {
                box.y = (Laya.stage.height - box.height) * 3 / 4;
            }
            setTimeout(() => {
                box.removeSelf();
                if (end)
                    end();
            }, time);
        }
        static confirm(content, options = {}, yes = null, cancel = null) {
            let box = this.root.addChild(new Laya.Box());
            let imgBg = box.addChild(new Laya.Sprite());
            let txtContent = box.addChild(new Laya.Label());
            let txtTitle = box.addChild(new Laya.Label());
            let txtBtnCancel = box.addChild(new Laya.Label());
            let txtBtnYes = box.addChild(new Laya.Label());
            txtTitle.dataSource = txtBtnCancel.dataSource = txtBtnYes.dataSource = txtContent.dataSource = {
                padding: "20,20,20,20",
                font: "SimHei",
                fontSize: 30,
                width: Laya.stage.width * 0.6,
                color: "#000000",
                align: "center",
                x: 0,
                y: 0,
                text: "提示",
                overflow: "hidden",
            };
            txtContent.dataSource = {
                padding: "20,20,40,20",
                overflow: "",
                fontSize: 25,
                wordWrap: true,
                text: content,
                color: options.contentColor || "#5A5A5A",
                y: txtTitle.height,
            };
            txtBtnCancel.dataSource = {
                text: options.cancelText || '否',
                width: txtTitle.width / 2,
                y: txtTitle.height + txtContent.height,
            };
            txtBtnYes.dataSource = {
                text: options.yesText || '是',
                width: txtTitle.width / 2,
                color: "#169C24",
                y: txtTitle.height + txtContent.height,
                x: txtTitle.width / 2,
            };
            box.dataSource = {
                width: Laya.stage.width * 0.6,
                height: txtTitle.height + txtContent.height + txtBtnYes.height,
                x: Laya.stage.width * 0.2,
                y: (Laya.stage.height - txtTitle.height - txtContent.height - txtBtnYes.height) / 2,
            };
            imgBg.graphics.drawPath(0, 0, roundRectPath(0, 0, box.width, box.height, 10), { fillStyle: "#FFFFFF" });
            imgBg.graphics.drawLine(0, txtTitle.height + txtContent.height, box.width, txtTitle.height + txtContent.height, "#D2D2D2", 1);
            imgBg.graphics.drawLine(box.width / 2, txtTitle.height + txtContent.height, box.width / 2, box.height, "#D2D2D2", 1);
            txtBtnCancel.on(Laya.Event.CLICK, this, (e) => { box.removeSelf(); if (cancel)
                cancel(); });
            txtBtnYes.on(Laya.Event.CLICK, this, (e) => { box.removeSelf(); if (yes)
                yes(); });
        }
        static showLoading() {
            if (!this.LoadingBox) {
                let arr = [
                    { x: Math.SQRT1_2, y: Math.SQRT1_2 }, { x: 0, y: 1 },
                    { x: -Math.SQRT1_2, y: Math.SQRT1_2 }, { x: -1, y: 0 },
                    { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 0, y: -1 },
                    { x: Math.SQRT1_2, y: -Math.SQRT1_2 }, { x: 1, y: 0 },
                ];
                this.LoadingBox = this.root.addChild(new Laya.Box());
                this.LoadingBox.width = this.LoadingBox.height = 120;
                this.LoadingBox.anchorX = this.LoadingBox.anchorY = 0.5;
                this.LoadingBox.x = Laya.stage.width / 2;
                this.LoadingBox.y = Laya.stage.height / 2;
                for (let i = 0; i < 8; i++) {
                    this.LoadingBox.graphics.drawCircle(arr[i].x * 60 + 60, arr[i].y * 60 + 60, 14 - i, "rgba(255,255,255," + (1 - 0.05 * i) + ")");
                }
            }
            this.LoadingBox.visible = true;
            this.LoadingTimer && clearInterval(this.LoadingTimer);
            this.LoadingTimer = setInterval(() => {
                this.LoadingBox.rotation -= 2;
            }, 30);
        }
        static hideLoading() {
            this.LoadingTimer && clearInterval(this.LoadingTimer);
            this.LoadingBox.visible = false;
        }
    }
    TipsUtil.root = null;
    TipsUtil.LoadingBox = null;
    TipsUtil.LoadingTimer = null;

    class EventCenter {
        constructor() {
            this.listeners = {};
            this.listener_name = [];
        }
        static getInstance() {
            if (!this.instance || this.instance == null) {
                this.instance = new EventCenter();
            }
            return this.instance;
        }
        on(name, callback, context) {
            let observers = this.listeners[name];
            if (!observers) {
                this.listeners[name] = [];
            }
            this.listeners[name] = [];
            this.listeners[name].push(new Observer(callback, context));
        }
        removeListener(name, context) {
            let observers = this.listeners[name];
            if (!observers)
                return;
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
        removeAllListener() {
            this.listeners = {};
            console.log("event center clean all ", this.listeners);
        }
        removeTypeListener() {
            for (let i = 0; i < this.listener_name.length; i++) {
                delete this.listeners[this.listener_name[i]];
            }
        }
        post(name, ...args) {
            let observers = this.listeners[name];
            if (!observers)
                return;
            let length = observers.length;
            for (let i = 0; i < length; i++) {
                let observer = observers[i];
                observer.notify(...args);
            }
        }
    }
    EventCenter.instance = null;
    class Observer {
        constructor(callback, context) {
            this.callback = null;
            this.context = null;
            let self = this;
            self.callback = callback;
            self.context = context;
        }
        notify(...args) {
            let self = this;
            self.callback.call(self.context, ...args);
        }
        compar(context) {
            return context == this.context;
        }
    }
    class EventName {
    }
    EventName.CoinBox_RefreshCoin = "CoinBox_RefreshCoin";

    class CoinMg {
        constructor() {
            this.isDoubleCoin = false;
            this.coin = 0;
            this.GetCoinTimes = 3;
        }
        static get Instance() {
            if (!CoinMg.instance) {
                CoinMg.instance = new CoinMg();
            }
            return CoinMg.instance;
        }
        init(debugNum) {
            if (debugNum) {
                this.coin = debugNum;
            }
            else {
                this.coin = LocalStorageUtil.getNumber(LocalStorageKey.COIN, 0);
            }
            console.log("CoinUtil init success:coin=", this.coin);
        }
        doubleCoin(isDouble) {
            this.isDoubleCoin = isDouble;
        }
        addCoin(addNum, isShowTips = true) {
            this.coin += addNum;
            LocalStorageUtil.setNumber(LocalStorageKey.COIN, this.coin);
            if (isShowTips) {
                TipsUtil.msg("获得" + addNum + "金币");
            }
            EventCenter.getInstance().post(EventName.CoinBox_RefreshCoin);
        }
        reduceCoin(reduceNum) {
            if (this.coin < reduceNum) {
                TipsUtil.msg("金币不足");
            }
            else {
                this.coin -= reduceNum;
                LocalStorageUtil.setNumber(LocalStorageKey.COIN, this.coin);
                EventCenter.getInstance().post(EventName.CoinBox_RefreshCoin);
            }
        }
        getCoin() {
            return this.coin;
        }
    }

    class BaseDialog extends Laya.Script {
        constructor() {
            super(...arguments);
            this.aldPage = "BaseDialog";
        }
        onEnable() {
            console.log(this.owner.url, "------------------onEnable");
            this.aldPage = this.owner.url.substring(this.owner.url.lastIndexOf("/"), this.owner.url.lastIndexOf(".scene"));
            this.initData();
            this.findView();
            this.initView();
            this.screenAdaptation();
        }
        onStart() {
            console.log(this.owner.url, "------------------onStart");
            AldMg.upload(this.aldPage);
        }
        onDisable() {
            console.log(this.owner.url, "------------------onDisable");
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
        setIsShowMisLead(isShow, view) {
            let oldY;
            if (isShow) {
                view.visible = true;
                oldY = view.y;
                try {
                    Laya.timer.clearAll(this);
                    Laya.timer.once(1500, this, () => {
                        Laya.Tween.to(view, { "y": oldY }, 300, null, null, 200);
                    });
                }
                catch (error) { }
            }
            else {
                view.visible = false;
                view.alpha = 0.3;
                Laya.timer.once(1000, this, function () {
                    view.visible = true;
                });
            }
        }
        startAni(name, isLoop) {
            let ani = this.owner[name];
            if (ani) {
                ani.play(null, isLoop);
            }
        }
        refreshCoin() {
            let coinBox = this.owner.getChildByName("coinBox");
            if (coinBox) {
                PlatformMg.Instance.topMidle(coinBox);
                let coinLb = coinBox.getChildByName("coinLb");
                let coinNum = CoinMg.Instance.getCoin();
                if (coinLb != null) {
                    if (coinNum >= 10000) {
                        coinLb.text = (coinNum / 1000).toFixed(1) + "k";
                    }
                    else {
                        coinLb.text = String(coinNum);
                    }
                }
            }
        }
    }

    class LoadingSc extends BaseDialog {
        initData() {
        }
        findView() {
        }
        initView() {
        }
        screenAdaptation() {
        }
        onClick() {
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("UI/BaseDialogRt.ts", BaseDialogRt);
            reg("UI/Scripts/LoeadingSc.ts", LoadingSc);
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1334;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Scenes/LoadingSc.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
