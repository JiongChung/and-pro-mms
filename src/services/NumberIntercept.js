export const numberIntercept = function(value, args) {
    if(value !== null){
        if(args !== undefined){
            if(value.length > args){
                let divisible = ((value.length - args) % 2 === 0) ? true : false;
                let result = (value.length - args) / 2;
                if(divisible){
                    value = value.substr(0,result) + '***' + value.substr(value.length - result);
                }else{
                    value = value.substr(0, parseInt(result)) + '***' + value.substr(value.length - parseInt(result) - 1);
                }
            }
        }else{
            if(value.length > 13){
                value = value.substr(0,5) + '***' + value.substr(value.length - 5);
            }else if(value.length === 11){
                value = value.substr(0,3) + '****' + value.substr(value.length - 4);
                /**手机号码处理**/
            }
        }
    }
    return value;
}