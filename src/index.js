
const xlsx = require('node-xlsx');
const  { pinyin } = require("pinyin")
const fs = require("fs")
const path = require('path')
const { isChineseStart,toTitle } = require("./shared/utils.js")

async function transformData(pathName,name){
    const list = xlsx.parse(pathName)
    for(const sheet of list){
        let flag = false
        for(const rows of sheet.data){
            if(flag == false) {
                // 跳过标题
                flag = true
                continue
            }
            // 去除手尾空格
            rows[0] = rows[0].trim()
            if (!isChineseStart(rows[0])){
                // 不是中文开头的直接跳过
                continue
            }
            // console.log(rows[0])
            // 字符串分割 按照不是中文的字符进行分割，然后拿到第一个中文
            const name = rows[0].split(/[^\u4E00-\u9FA5]/)[0]
            let pinyinNames = pinyin(name, { style: pinyin.STYLE_NORMAL });
            // 数组平铺
            pinyinNames = pinyinNames.flat(1)
            const firstNamePinyin = pinyinNames.shift()
            const firstName = toTitle(firstNamePinyin)
            const tempLastName = pinyinNames.join("")
            const lastName = toTitle(tempLastName)
            rows[1] = name + " " + lastName +  " " + firstName 
        }
    }
    const outputDirName = path.resolve(__dirname,"./output")
    if(!fs.existsSync(outputDirName)) fs.mkdirSync(outputDirName)
    fs.writeFileSync(path.resolve(outputDirName,name),xlsx.build(list),{ encoding:"binary",flag:"w+" });
}

function main(){
    const fileList = fs.readdirSync("./data")
    for(let fileName of fileList){
        let extName = path.extname(fileName)
        if(extName != ".xlsx") continue
        transformData(`./data/${fileName}`,fileName)
        console.log(fileName + "转换成功,请在output文件夹中查看结果")
    }
}
main()
