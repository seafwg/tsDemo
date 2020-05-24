import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import whfAnalyzer from './whfAnalyzer'

/**
 * 分析策略函数返回的数据注解
 */
export interface AnalyzerType {
  WhfAnalize: (resHtml: string, filePath: string) => string
}


/**
 * 新建爬虫类
 */
class Crowller {
  private rawHtml = '';
  private filePath = path.resolve(__dirname, `../../data/new${Math.random() * 10}.html`);
  constructor(private URL: string, private analyzer: AnalyzerType) {
    this.initCrowllerProcess();
  }
  /**
   * 初始化爬虫入口函数，调用爬虫中所用到的方法，目的是写成纯函数，每个函数功能单一，函数之间没有耦合。
   * //? 爬虫的流程：1.获取内容，2.进行内容的解析，3.生成自己所需要的数据，4.进行存储
   */
  private async initCrowllerProcess() {
    const resHtml = await this.getRawHtmlCon();
    // 调用分析策略函数
    const FileContent = this.analyzer.WhfAnalize(resHtml, this.filePath);
    this.writeJSON(FileContent);
  }
  /**
   * 通过superagent发起请求获取html页面内容
   */
  private async getRawHtmlCon() {
    const result = await superagent.get(this.URL);
    this.rawHtml = result.text;
    return this.rawHtml;
  }

  /**
   * 写入文件：
   */
  private writeJSON(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}



const isbn = '小姐姐';
const URL = encodeURI(`https://www.toutiao.com/search/?keyword=${isbn}`);
const whfAnalyze = whfAnalyzer.getInstance();
new Crowller(URL, whfAnalyze);

/**
 * 此类也改进不能被外部访问里面的方法：
 */