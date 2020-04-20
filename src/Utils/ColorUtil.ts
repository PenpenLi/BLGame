import { hex_to_ten } from "./common";

export const setTrailColor: Function = (trail: Laya.TrailSprite3D) => {
    trail.trailFilter.colorGradient["_rgbElements"] = [1, 1, 1, 1, 1, 1, 1, 1];
}


/**
 * 颜色字符串转颜色空间值
 * @param colorTx 
 */
export const colorStr_2_U3dColor: Function = (colorTx: string) => {
    if (!colorTx) {
        throw Error("输入颜色值为空");
    }
    if (colorTx.length != 6) {
        throw Error("输入颜色值格式错误");
    }

    let color_v3 = new Laya.Vector3();

    let rgb = colorStr_2_RGB(colorTx);
    color_v3 = RGB_2_U3dColor(rgb);
    return color_v3;
}

/**
 * 颜色字符串转RGB
 * @param colorTx 
 */
export const colorStr_2_RGB: Function = (colorTx: string) => {
    if (!colorTx) {
        throw Error("输入颜色值为空");
    }
    if (colorTx.length != 6) {
        throw Error("输入颜色值格式错误");
    }

    let rgb: {} = {};
    let r = colorTx.substr(0, 2);
    let g = colorTx.substr(2, 2);
    let b = colorTx.substr(4, 2);

    rgb = { r: hex_to_ten(r), g: hex_to_ten(g), b: hex_to_ten(b) }
    return rgb;
}

/**
 * RGB转颜色空间值
 * @param rgb 
 */
export const RGB_2_U3dColor: Function = (rgb: any) => {
    if (!rgb) {
        throw Error("输入RGB颜色值为空");
    }

    if (rgb.r == null || rgb.g == null || rgb.b == null) {
        throw Error("输入RGB颜色值格式不正确");
    }


    let num_r = Number((rgb.r / 255).toFixed(2));
    let num_g = Number((rgb.g / 255).toFixed(2));
    let num_b = Number((rgb.b / 255).toFixed(2));
    return new Laya.Vector3(num_r, num_g, num_b);
}

/**
 * 颜色空间值 Vector3 转 Vector4
 * @param v3 
 */
export const V3_2_V4: Function = (v3: Laya.Vector3) => {
    if (!v3) {
        throw Error("输入Vector3颜色空间值为空");
    }

    return new Laya.Vector4(v3.x, v3.y, v3.z, 1);
}

/**
 * 颜色空间值 Vector4 转 Vector3
 * @param v4 
 */
export const V4_2_V3: Function = (v4: Laya.Vector4) => {
    if (!v4) {
        throw Error("输入Vector4颜色空间值为空");
    }
    return new Laya.Vector3(v4.x, v4.y, v4.z);
}




