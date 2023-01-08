// 检查字符串是否是以中文开头
function isChineseStart(temp){
    let re = /^[\u4E00-\u9FA5]+/;
    if (re.test(temp)) return true ;
    return false ;
}

function toTitle(temp){
    return temp.slice(0,1).toUpperCase() + temp.slice(1).toLowerCase()
}
module.exports = {
    isChineseStart,
    toTitle
}