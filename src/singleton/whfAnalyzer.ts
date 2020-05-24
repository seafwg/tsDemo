import fs from 'fs'
import cheerio from 'cheerio'
import { AnalyzerType } from './whfCrowller'

interface InfosType {
  title: string
  num: number
}
interface ReadHtmlType {
  time: number
  data: InfosType[]
}

interface FileContentType {
  [propName: number]: InfosType[]
}


export default class WhfAnalyzer implements AnalyzerType {
  private constructor() { }
  private static instance: WhfAnalyzer
  // 内部实例化类函数，返回给外部调用类的实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new WhfAnalyzer();
    }
    return this.instance
  }
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

  private readHtml(data: ReadHtmlType, filePath: string) {
    let fileContent: FileContentType = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[data.time] = data.data;
    return fileContent;
  }

  public WhfAnalize(resHtml: string, filePath: string) {
    const res = this.getInfoData(resHtml, filePath); // 解析文件
    const resData = this.readHtml(res, filePath); // 读取文件，拼接成自己的数据结构

    return JSON.stringify(resData)
  }

}

/**
 * ? 单例模式：保证一个特定类只有一个实例，第二次使用同一个类创建新对象的时候，应该得到与第一次创建对象完全相同的对象。
 * ? 也就是不能被外部实例化,在内部返回一个函数进行实例化的具体方法，外部只能调用这个方法。
 */