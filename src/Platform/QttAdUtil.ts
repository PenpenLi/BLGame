// /**
//  * 趣头条 广告
//  */
// export default class QttADUtil {
//     static HDoptions: any = {
//         index: 1,//广告位置（1，2，3，4...）
//         gametype: 1,//互动游戏类型，1(砸金蛋)  2(laba)  3(大转盘)
//         rewardtype: 1,//互动广告框，只有 1
//         data: {
//             title: '中奖啦'
//         }
//     }

//     /**
//         * 视频播放管理类
//         * @param options 
//         * @param {Function} options.before 领取前执行
//         * @param {Function} options.complete 领取完成时执行
//         * @param {Function} options.success 领取成功时执行
//         * @param {Function} options.fail 领取失败时执行
//         * @param {Function} options.error　领取异常时执行
//         * @param {string} options.errorMsg 异常时提示消息
//         * @param {string} options.failMsg 领取失败时提示消息
//      */
//     static showVideo(options: any): void {
//         try {
//             if (qttGame == null || qttGame == undefined) {
//                 options.success && options.success();
//                 return
//             }

//             SoundUtil.Instance().stopMusic();
//             qttGame.showVideo(
//                 (res) => {
//                     switch (res) {
//                         case 0://res = 0    填充不足
//                             console.log('视频填充不足！！！')
//                             SoundUtil.Instance().playMusic();
//                             break;
//                         case 1://播放完成，发放奖励
//                             options.success && options.success();
//                             SoundUtil.Instance().playMusic();
//                             break;
//                         case 2://res = 2    提前关闭
//                             options.fail && options.fail();
//                             SoundUtil.Instance().playMusic();
//                             break;
//                         default:
//                             options.fail && options.fail();
//                             SoundUtil.Instance().playMusic();
//                             break;
//                     }
//                 },
//                 QttADUtil.HDoptions
//             )
//         } catch (error) {
//             options.fail && options.fail();
//         }
//     }

//     /**
//         * 互动广告
//         * @param options 
//         * @param {number} options.index = 1;//广告位置（1，2，3，4...）
//         * @param {number} options.gametype =1;//互动游戏类型，1(砸金蛋)  2(laba)  3(大转盘)
//         * @param {number} options.rewardtype =1;//互动广告框，只有 1
//         * @param {Object} options.data ={};
//         * @param {string} options.data.title ="中奖啦";//互动抽中奖后的道具提示文字
//         * @param {string} options.data.url ="//newidea4-gamecenter-frontend.1sapp.com/game/prod/fkxxl_img/1.png"; // 动抽中奖后的道具图标(可选)
//         * @param {Function} options.callback =(res)=>{//回调函数
//                                             if(res ==1){
//                                                 //播放完成，发放奖励
//                                             }else{
//                                                 //res = 0    填充不足
//                                             }};
//      */
//     static showHDAD(options: any): void {
//         try {
//             if (qttGame == null || qttGame == undefined) {
//                 return
//             }

//             qttGame.showHDAD({
//                 index: options.index ? options.index : 1,
//                 gametype: options.gametype ? options.gametype : 1,
//                 rewardtype: 1,
//                 data: {
//                     title: options.data.title ? options.data.title : "刷新道具",
//                     url: options.data.url ? options.data.url : ''
//                 },
//                 callback: options.callback ? options.callback() : () => { TipsUtil.msg('暂不支持') }
//             })
//         } catch (error) {
//             options.fail && options.fail();
//         }
//     }

//     static showBanner() {
//         try {
//             if (qttGame == null || qttGame == undefined) {
//                 return
//             }
//             qttGame.showBanner({});
//         } catch (error) {

//         }

//     }

//     static hideBanner() {
//         try {
//             if (qttGame == null || qttGame == undefined) {
//                 return
//             }
//             qttGame.hideBanner();
//         } catch (error) {

//         }
//     }
// }