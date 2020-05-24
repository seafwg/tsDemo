import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import cheerio from 'cheerio'

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
/**
 * 
 */
interface FileContentType {
  [propName: number]: InfosType[]
}


/**
 * 新建爬虫类
 */
class Crowller {
  private isbn = 9787101003048;
  private URL = `https://search.douban.com/book/subject_search?search_text=${this.isbn}`;
  public rawHtml = '';
  public filePath = path.resolve(__dirname, "../data/nav.json");
  constructor() {
    this.initCrowllerProcess();
  }
  /**
   * 初始化爬虫入口函数，调用爬虫中所用到的方法，目的是写成纯函数，每个函数功能单一，函数之间没有耦合。
   * //? 爬虫的流程：1.获取内容，2.进行内容的解析，3.生成自己所需要的数据，4.进行存储
   */
  async initCrowllerProcess() {
    const resHtml = await this.getRawHtmlCon();
    const res = this.getInfoData(resHtml);
    const resData = this.readHtml(res);
    this.writeJSON(JSON.stringify(resData));
  }
  /**
   * 1.通过superagent发起请求获取html页面内容
   */
  async getRawHtmlCon() {
    const result = await superagent.get(this.URL);
    this.rawHtml = result.text;
    return this.rawHtml;
  }
  /**
   * 2.解析html页面内容，拼接称自己所需的数据结构：
   */
  getInfoData(html: string) {
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
   * 3.读取文件：
   */
  readHtml(data: ReadHtmlType) {
    let fileContent: FileContentType = {};
    // 如果文件存在读出来，保存在fileContent
    if (fs.existsSync(this.filePath)) {
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    fileContent[data.time] = data.data;
    return fileContent;
  }
  /**
   * 4.写入文件：
   */
  writeJSON(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

new Crowller();
console.log('object')
console.log("seafwg is very ...")