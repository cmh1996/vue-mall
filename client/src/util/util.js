//获取屏幕宽高
export function getClientSize(){
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    let w = document.documentElement.clientWidth || document.body.clientWidth;
    return {
        width:w,
        height:h
    }
}

//获取滚动条宽度
export function getScrollWidth() {
  let noScroll, scroll, oDiv = document.createElement("DIV");
  oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
  noScroll = document.body.appendChild(oDiv).clientWidth;
  oDiv.style.overflowY = "scroll";
  scroll = oDiv.clientWidth;
  document.body.removeChild(oDiv);
  return noScroll-scroll;
}

//回到顶部
export function backToTop(){
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if(scrollTop>0){
        window.requestAnimationFrame(backToTop);
        window.scrollTo(0,scrollTop-(scrollTop/5));
    }
}

//取本地储存数据
export function getLocalItem(key){
    let value;
    try {
        value = localStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('localStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置本地储存数据
export function setLocalItem(key, value){
    try {
        // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
        localStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('localStorage.setItem报错, ', ex.message);
        }
    }
}

//取会话储存数据
export function getSessionItem(key){
    let value;
    try {
        value = sessionStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('sessionStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置会话储存数据
export function setSessionItem(key, value){
    try {
        // ios safari 无痕模式下，直接使用 sessionStorage.setItem 会报错
        sessionStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('sessionStorage.setItem报错, ', ex.message);
        }
    }
}

//Unicode转中文汉字
export function decode(str){ 
    str = str.replace(/(\\u)(\w{1,4})/gi,function($0){ 
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g,"$2")),16))); 
    }); 
    str = str.replace(/(&#x)(\w{1,4});/gi,function($0){ 
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g,"$2"),16)); 
    }); 
    str = str.replace(/(&#)(\d{1,6});/gi,function($0){ 
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g,"$2"))); 
    }); 
     
    return str; 
}

//转化为00:00时间格式
export function convertTime(seconds){
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

export function shuffle(arr){
    for(let i=arr.length-1;i>=0;i--){
        let randomIndex = Math.floor(Math.random()*(i+1));
        let itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}