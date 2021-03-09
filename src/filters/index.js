/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 全局过滤 将后台需要转换的数据进行处理
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-05-06 14:49:57
 */

//对手机号中间四位用*代替
export const formatPhone = function(phone) {
    let mphone = phone.substr(0, 3) + '****' + phone.substr(7);
    return mphone;
}
//对身份证号中间八位用*代替
export const formatIdCard = function(idCard) {
    let mpIdCard = idCard.substr(0, 6) + '********' + idCard.substr(14,4);
    return mpIdCard;
}