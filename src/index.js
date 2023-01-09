#! /usr/bin/env node
const xlsx = require('node-xlsx');
const  { pinyin } = require("./shared/utils.js")
const fs = require("fs")
const path = require('path')
const { isChineseStart,toTitle } = require("./shared/utils.js")
async function transformData(pathName,name){
    try {
        console.log(pathName,"正在转换")
        const list = xlsx.parse(pathName)
        for(const sheet of list){
            let flag = false
            for(const rows of sheet.data){
                if(flag == false) {
                    if(rows.length !== 2 || rows[0] !== "姓名原版" || rows[1] !== "姓名"){
                        console.log(pathName,"文件格式不符合要求")
                        console.log("-----格式要求-----")
                        console.log("姓名原版   姓名")  
                        console.log(" xxxx        ")  
                        console.log(" xxxx        ")  
                        return false
                    }
                    // 跳过标题
                    flag = true
                    continue
                }
                if(Number.isInteger(rows[0])) continue
                if(!rows[0]) continue
                // 去除首尾空格
                rows[0] = rows[0].trim()
                if (!isChineseStart(rows[0])){
                    // 不是中文开头的直接跳过
                    continue
                }
                if(!rows[0]) continue
                // console.log(rows[0])
                // 字符串分割 按照不是中文的字符进行分割，然后拿到第一个中文
                const name = rows[0].split(/[^\u4E00-\u9FA5]/)[0]
                let pinyinNames = pinyin(name);
                // 数组平铺
                const firstNamePinyin = pinyinNames.shift()
                const firstName = toTitle(firstNamePinyin)
                const tempLastName = pinyinNames.join("")
                const lastName = toTitle(tempLastName)
                rows[1] = name + " " + lastName +  " " + firstName 
            }
        }
        const outputDirName = path.resolve(process.cwd(),"./output")
        if(!fs.existsSync(outputDirName)) fs.mkdirSync(outputDirName)
        fs.writeFileSync(path.resolve(outputDirName,name),xlsx.build(list),{ encoding:"binary",flag:"w+" });
        return true
    } catch (error) {
        console.log("您的excel中出现了未知的格式,请查看")
        return false
    }
}

function main(){
    const filePath = path.resolve(process.cwd(),"./data")
    if(!fs.existsSync(filePath)){
        console.log("对不起,当前路径:" + process.cwd() + " 下,没有data文件夹")
        console.log('请创建data文件夹,里面可以放置多个需要转换的excel文件')
        return
    }
    const fileList = fs.readdirSync(filePath)
    if(fileList.length == 0) {
        console.log("data文件夹下没有需要转换的文件,请添加以 .xlsx 结尾的文件")
        return
    }
    for(let fileName of fileList){
        let extName = path.extname(fileName)
        // 解决mac下的问题
        console.log()
        if(extName != ".xlsx" || fileName.startsWith(".")) continue
        let res = transformData(path.resolve(filePath,fileName),fileName)
        if(res){
            console.log(fileName + "转换成功,请在output文件夹中查看结果")
        }
    }
}
main()
