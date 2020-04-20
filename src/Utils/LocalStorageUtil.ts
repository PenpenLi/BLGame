import ConfigData from "../Data/ConfigData";

export default class LocalStorageUtil {
    private static rootPath: string = ConfigData.GAME_NAME + "_";

    public static remove(key: string) {
        if (key == null || key == "") {
            console.error(this.name + "---> remove err : key undefind");
            return;
        }
        Laya.LocalStorage.removeItem(LocalStorageUtil.rootPath + key);
    }

    /**
     * 存储字符
     * @param key 键
     * @param value 值
     */
    public static setString(key: string, value: string) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setString err : key or value undefind");
            return;
        }

        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value);
    }

    /**
     * 存储数值
     * @param key 键
     * @param value :值
     */
    public static setNumber(key: string, value: number) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setNumber err : key or value undefind");
            return;
        }

        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, String(value));
    }

    /**
     * 存储boolean值
     * @param key 键
     * @param value 值
     */
    public static setBoolean(key: string, value: boolean) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setBoolean err : key or value undefind");
            return;
        }

        Laya.LocalStorage.setItem(LocalStorageUtil.rootPath + key, value ? "1" : "0");
    }

    /**
 * 存储数组
 * @param key 键
 * @param def_value 默认值
 */
    public static setList(key: string, value: any[]) {
        if (value == null || key == null || key == "") {
            console.error(this.name + "---> setList err : key or value undefind");
            return;
        }
        console.log("存储数组：", value);
        Laya.LocalStorage.setJSON(LocalStorageUtil.rootPath + key, value);
    }



    /**
     *  取出存储的字符
     * @param key 键
     * @param def_value 默认值
     */
    public static getString(key: string, def_value?: string) {
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
            } else {
                return null;
            }
        }
    }

    /**
     * 取出数字
     * @param key 键
     * @param def_value 默认值 
     */
    public static getNumber(key: string, def_value?: number) {
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
        } else {
            return Number(val);
        }
    }

    /**
   * 取出boolean值
   * @param key 键
   * @param def_value 默认值
   */
    public static getBoolean(key: string, def_value?: boolean) {
        if (key == null || key == "") {
            console.error(this.name + "---> getBoolean err : key undefind");
            return;
        }


        let val = Laya.LocalStorage.getItem(LocalStorageUtil.rootPath + key);
        if (!val || val == "") {
            if (def_value != null) return def_value;
            else return false;
        } else {
            return val == "1";
        }
    }

    /**
     * 取出数组
     * @param key 键
     * @param def_value 默认值
     */
    public static getList(key: string, def_value?: any[]) {
        if (key == null || key == "") {
            console.error("getList err : key undefind");
            return;
        }

        let list: any = Laya.LocalStorage.getJSON(LocalStorageUtil.rootPath + key);
        if (!list) {
            if (def_value) {
                return def_value;
            } else {
                return null;
            }
        } else {
            console.log("取出数组：", list);
            return list;
        }
    }
}