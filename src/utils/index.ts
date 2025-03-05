/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

export function mix(color1: string, color2: string, weight: number) {
  weight = Math.max(Math.min(Number(weight), 1), 0);
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  const rStr = ('0' + (r || 0).toString(16)).slice(-2);
  const gStr = ('0' + (g || 0).toString(16)).slice(-2);
  const bStr = ('0' + (b || 0).toString(16)).slice(-2);
  return '#' + rStr + gStr + bStr;
}

/**
 * Arr 为filter的整个数组
 * 取 cAttributeCode 和  cAttributeCodeValue 整合一个string
 * return 为 code1 in ('11','22') and code2 in ('33','44')
 */
// 整合 filter 数据形式
export function filterModel(Arr: Array<any>) {
  const arrObj: Array<any> = [];
  Arr.forEach(item => {
    if (item.cAttributeCodeValue) {
      if (item.cControlTypeCode == 'DatePicker2') {
        arrObj.push(
          `${item.cAttributeCode} >= ${item.cAttributeCodeValue[0]}T00:00:00`,
          `${item.cAttributeCode} <= ${item.cAttributeCodeValue[1]}T23:59:59`
        );
      } else if (
        item.cConditions === 'in' &&
        item.treeSelectedValues?.length > 0
      ) {
        arrObj.push(
          `${item.cAttributeCode} ${
            item.cConditions
          } (${item.treeSelectedValues?.join(',')})`
        );
      } else {
        arrObj.push(
          `${item.cAttributeCode} ${item.cConditions} ${item.cAttributeCodeValue}`
        );
      }
    }
  });
  const rpx2 = /\s\s/gi;
  const rpx3 = /\s\s\s/gi;
  const str = arrObj.filter(i => i).join(' && ');
  if (rpx3.test(str)) {
    return str.replace(rpx3, ' ');
  } else if (rpx2.test(str)) {
    return str.replace(rpx2, ' ');
  } else {
    return str;
  }
}
/**
 * 整合对象，拼接为字符串
 * obj={
 *  aa:1,
 *  bb:2
 * }
 *  拼接：aa=1&&bb=2
 */
//
export function spellObj(obj: any) {
  if (obj.toString() !== '{}') {
    const strArr = [];
    for (const v in obj) {
      // console.log(v,obj[v],"00-");
      if (!(obj[v] === '' || obj[v] === null || obj[v] === undefined)) {
        strArr.push(v + '=' + obj[v]);
      }
    }
    return strArr.join('&&');
  }
}
// 整合table 排序
export function tableSortModel(Arr: Array<any>) {
  const arrObj: Array<any> = [];
  Arr.forEach(item => {
    if (item.slot && item.slot != '') {
      arrObj.push(item.prop + ' ' + item.slot);
    }
  });
  return arrObj.join(' , ');
}
// table 排序 重置
export function tableSortInit(Arr: Array<any>) {
  Arr.forEach(item => {
    item.slot = '';
  });
  return Arr;
}

// 数组对象排序

// let list = [
//   {id: 1, name: '章三'},
//   {id: 10, name: 'wangwu'},
//   {id: 2, name: 'list'}
// ]
// // 用id 字段做升序排序
// let d = list.sort(compare('id', true))
// console.log(d) // [{id: 1, name: '章三'}, {id: 2, name: 'list'}, {id: 10, name: 'wangwu'}]

export function compare(attr: any, rev: any) {
  // console.log(attr, rev)
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = rev ? 1 : -1;
  }
  return (a: any, b: any) => {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  };
}
// 防抖
export function _debounce(fn: any, delay: any) {
  // eslint-disable-next-line no-var
  var delay = delay || 200;
  let timer: any;
  return function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const th = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}
// 节流
export function _throttle(fn: any, interval: any) {
  let last: any;
  let timer: any;
  // eslint-disable-next-line no-var
  var interval = interval || 200;
  return function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const th = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
}

/**
 *
 * @param {*} src 文件url链接
 * @param {*} fileName 文件名+后缀
 * @param {*} fileType 文件类型（后缀）
 * @param {*} isNotImage 是否是图片
 */
export default function download(
  src: any,
  fileName: any,
  fileType: any,
  isNotImage: any
) {
  if (isNotImage) {
    //判断是否为chrome里的图片
    fileLinkToStreamDownload(src, fileName, fileType);
  } else {
    ImgtodataURL(src, fileName, fileType);
  }
}

function fileLinkToStreamDownload(url: any, fileName: any, type: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.setRequestHeader('Content-type', `application/${type}`);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (this.status == 200) {
      const blob = this.response;
      downloadNormalFile(blob, fileName);
    }
  };
  xhr.send();
}

function downloadNormalFile(blob: any, filename: any) {
  const eleLink = document.createElement('a');
  let href = blob;
  if (typeof blob == 'string') {
    eleLink.target = '_blank';
  } else {
    href = window.URL.createObjectURL(blob); //创建下载的链接
  }
  eleLink.href = href;
  eleLink.download = filename; //下载后文件名
  eleLink.style.display = 'none';
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click(); //点击下载
  //下载完成移除元素
  document.body.removeChild(eleLink);
  if (typeof blob == 'string') {
    window.URL.revokeObjectURL(href); //释放掉blob对象
  }
}

function ImgtodataURL(url: any, filename: any, fileType: any) {
  getBase64(url, fileType, (_baseUrl: string) => {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 图片转base64地址
    eleLink.href = _baseUrl;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  });
}

function getBase64(url: any, fileType: any, callback: any) {
  //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片
  const Img = new Image(),
    dataURL = '';
  Img.src = url;
  Img.setAttribute('crossOrigin', 'Anonymous');
  Img.onload = function () {
    //要先确保图片完整获取到，这是个异步事件
    // eslint-disable-next-line prefer-const
    const canvas = document.createElement('canvas'), //创建canvas元素
      width = Img.width, //确保canvas的尺寸和图片一样
      height = Img.height;
    canvas.width = width;
    canvas.height = height;
    // canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
    // dataURL = canvas.toDataURL('image/' + fileType); //转换图片为dataURL
    callback ? callback(dataURL) : null;
  };
}
