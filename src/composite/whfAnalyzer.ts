import fs from 'fs'
import cheerio from 'cheerio'
import { AnalyzerType } from './whfCrowller'
/**
 * 注解数据类型接口：
 */
interface InfosType {
  title: string
  num: number
}
/**
 * 最终自己拼接的数据类型注解
 */
interface ReadHtmlType {
  time: number
  data: InfosType[]
}

interface FileContentType {
  [propName: number]: InfosType[]
}


// WhfAnalyzer类也要遵守AnalyzerType注解
export default class WhfAnalyzer implements AnalyzerType {
  /**
 * 解析html页面内容，拼接称自己所需的数据结构：
 */
  private getInfoData(html: string, filePath: string) {
    const $ = cheerio.load(html);
    const content = $('.nav-items a');
    const infos: InfosType[] = [];
    content.map((index, ele) => {
      const title = $(ele).text();
      const num = index;
      infos.push({ title, num })
    })

    return {
      time: new Date().getTime(),
      data: infos
    };
  }
  /**
  * 读取文件：
  */
  readHtml(data: ReadHtmlType, filePath: string) {
    let fileContent: FileContentType = {};
    // 如果文件存在读出来，保存在fileContent
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[data.time] = data.data;
    return fileContent;
  }

  // 初始化分析策略入口函数：
  public WhfAnalize(resHtml: string, filePath: string) {
    const res = this.getInfoData(resHtml, filePath); // 解析文件
    const resData = this.readHtml(res, filePath); // 读取文件，拼接成自己的数据结构

    return JSON.stringify(resData)
  }
}