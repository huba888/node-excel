
import xlsx from 'node-xlsx';
import {pinyin} from "pinyin";
import fs from "fs"
// 名字里是否包含中文
function isChinese(temp){
    var re=/[\u4E00-\u9FA5]+/;
    if (re.test(temp)) return true ;
    return false ;
}

const list = xlsx.parse("./表格数据/test1.xlsx")

for(const sheet of list){
    let flag = false
    for(const rows of sheet.data){
        if(flag == false) {
            // 跳过标题
            flag = true
            continue
        }
        if (!isChinese(rows[0])){
            // 不包含中文的行直接跳过
            continue
        }
        // console.log(rows[0])
        // 字符串截取,截取到不是中文为止  拿到中文名字
        const name = rows[0].split(/[^\u4E00-\u9FA5]/)[0]
        let pinyinNames = pinyin(name, {style: pinyin.STYLE_NORMAL,});
        pinyinNames = pinyinNames.flat(1)
        const firstName = pinyinNames[0].slice(0,1).toUpperCase() + pinyinNames[0].slice(1)
        pinyinNames.shift()
        const tempLastName = pinyinNames.join("")
        const lastName = tempLastName.slice(0,1).toUpperCase() + tempLastName.slice(1)
        rows[1] = name + " " + lastName +  " " + firstName 
        console.log(name + " " + lastName +  " " + firstName )
    }
}
fs.writeFileSync('./hello.xlsx',xlsx.build(list),"binary");