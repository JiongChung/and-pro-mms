export default class CommonService {
    interval = null;
    
    static int(int){
        let myreg = /^[0-9]*[0-9][0-9]*$/;
        return myreg.test(int);
    }

    static phone(phone){
        let myreg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
        return myreg.test(phone);
    }

    static password(password){
        let myreg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
        return myreg.test(password);
    }

    static setTimer(countdownDate, callbak) {
        this.interval = setInterval(() => {
            let time = this.getDateData(countdownDate);
            callbak && callbak(time)
        }, 1000);
    }

    static getDateData(countdownDate) {
        let prams = {};
        let status = true;
        let times = (Date.parse(new Date(countdownDate)) - Date.parse(new Date())) / 1000;
     
        if (times <= 0) {
            this.stop();
            return {second: 0, status: true};
        }else{
            status = false;
        }

        prams.second = times;
        prams.status = status;
        return prams;
    }
     
      
    /** 清除定时器 */
    static stop() {
        clearInterval(this.interval);
    }

    static setCookie(name,value){ 
        let exp = new Date(); 
        exp.setTime(exp.getTime() + 30*24*60*60*1000); 
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path=/";
    }
    
    static getCookie(name){ 
        let reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        let arr = document.cookie.match(reg);
        if(arr != null){
            return unescape(arr[2]); 
        }
        else{
            return null; 
        }    
    }

    static delCookie(name){ 
        let exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        let cval = this.getCookie(name); 
        if(cval !== null){
            document.cookie = name + "="+cval+";expires="+exp.toGMTString(); 
        } 
    }

    static islogin(){
        let status = false;
        let token = this.getCookie('Abp.AuthToken');
        if(token != null){
            status = true;
        }
        return status;
    }

    static get(key, type){
        return (type !== undefined) ? JSON.parse(window.localStorage.getItem(key)) : window.localStorage.getItem(key);
    }

    static save(key, value, type){
        return (type !== undefined) ? window.localStorage.setItem(key, JSON.stringify(value)) : window.localStorage.setItem(key, value);  
    }

    static remove(key){
        return window.localStorage.removeItem(key);
    }

    static getPermissions(name){
        let grantedPermissions = this.get('grantedPermissions','josn');
        let keyList = [];
        for(let key in grantedPermissions){
            keyList.push(key);
        }
        if(keyList.indexOf(name) === -1){
            return true;
        }
    }
}