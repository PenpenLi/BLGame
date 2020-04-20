import PlatformMg from "../Platform/PlatformMg";

export default class AldMg {
    static postAld = true;
    /**
     * 关卡开始
     */
    static onStart(id: string, name: string, user_id: string) {
        if (!this.postAld) {
            return;
        }

        let obj = {
            "stageId": id,
            "stageName": name,
            "userId": user_id
        }

        if (PlatformMg.Instance.platform) {
            try {
                PlatformMg.Instance.platform.aldStage.onStart(obj);
            } catch (error) {
                console.error("stageStart upload fail");
            }
        }
    }

    /**
     * 复活
     */
    static onRunning(id: string, name: string, user_id: string) {
        if (!this.postAld) {
            return;
        }

        let obj = {
            "stageId": id,
            "stageName": name,
            "userId": user_id,
            "event": "relive"
        }

        if (PlatformMg.Instance.platform) {
            try {
                PlatformMg.Instance.platform.aldStage.onRunning(obj);
            } catch (error) {
                console.error("onRunning upload fail");
            }
        }
    }

    /**
     * 关卡结束
     * @param _event  是否完成
     */
    static onEnd(id: string, name: string, user_id: string, event: boolean) {
        if (!this.postAld) {
            return;
        }

        let obj = {
            "stageId": id,
            "stageName": name,
            "userId": user_id,
            "event": event ? "complete" : "fail"
        }

        if (PlatformMg.Instance.platform) {
            try {
                PlatformMg.Instance.platform.aldStage.onEnd(obj);
            } catch (error) {
                console.error("onRunning upload fail");
            }
        }
    }

    /**
     * 上传自定义事件
     * @param obj 
     */
    static upload(obj) {
        if (!this.postAld) {
            return;
        }

        if (PlatformMg.Instance.platform) {
            try {
                PlatformMg.Instance.platform.aldSendEvent(obj);
            } catch (error) {

            }
        }
    }
}



