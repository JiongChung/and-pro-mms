import moment from "moment";
export const dateFormat = function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    if(dataStr){
        return moment(dataStr).format(pattern);
    }
}