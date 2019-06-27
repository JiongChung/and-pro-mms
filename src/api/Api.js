import axios from 'axios';
import CommonServices from '../services/CommonServices';
import { Modal } from 'antd';
import * as moment from 'moment';
const API =  'http://192.168.2.110';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + CommonServices.getCookie('Abp.AuthToken');

export const getChargeList = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','NickName','UserGradeId','AgentGradeId','PayMethod','ChargeType','Status','OilCardTypeId','PayFromDate','PayToDate','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/UserCharge/GetChargeList?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    });
}
export const getUserRechargeToExcel = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','NickName','UserGradeId','AgentGradeId','PayMethod','ChargeType','Status','OilCardTypeId','PayFromDate','PayToDate','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/UserCharge/GetUserRechargeToExcel?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    });; 
}
export const getChargeListInit = () => { return axios.post(API+'/api/services/app/UserCharge/Init').then(res => res.data).catch(error => {
    Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
        centered: true
    });
});};
// downloadTempFile 导出xls
export const downloadTempFile = params => {
    const url = API + '/File/DownloadTempFile?fileType=' + params.fileType + '&fileToken=' + params.fileToken + '&fileName=' + params.fileName;
    window.location.href = url; 
}
export const deleteCharge = params => { return axios.delete(API+'/api/services/app/UserCharge/DeleteCharge?Id=' + params).then(res => res.data).catch(error => {
    Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
        centered: true
    });
});};

export default API;