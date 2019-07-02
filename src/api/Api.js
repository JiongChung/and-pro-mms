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

// OilCardLoad 油卡圈存
export const getLoadCardList = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','OilCardNo','LoadFromDate','LoadToDate','Status','OilCardTypeId','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/OilCardLoad/GetLoadCardList?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    }); 
};
export const getLoadCardRechargeToExcel = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','OilCardNo','LoadFromDate','LoadToDate','Status','OilCardTypeId','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/OilCardLoad/GetLoadCardRechargeToExcel?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    }); 
}

export const loadCardUpdateStatus = params => { 
    return axios.put(API+'/api/services/app/OilCardLoad/UpdateStatus', params).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    }); 
}

export const getLoadCardRemartForEdit = params => { return axios.get(API+'/api/services/app/OilCardLoad/GetLoadCardRemartForEdit?id='+params).then(res => res.data).catch(error => {
    Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
        centered: true
    });
});  }

// UserAssetDrawingApply 提现申请
export const getDrawingApplyList = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','Status','DrawingFromDate','DrawingToDate','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/UserAssetDrawingApply/GetDrawingApplyList?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    }); 
};
export const getDrawingApplyListToExcel = (...params) => {
    let input = '';
    let paramsNameList = ['InviteCode','PhoneNumber','Status','DrawingFromDate','DrawingToDate','MaxResultCount','SkipCount'];
    paramsNameList.forEach((item, index) => {
        if(params[index] !== undefined){
            input += item + '=' + encodeURIComponent((typeof(params[index]) == 'object') ? moment(params[index].format('YYYY-MM-DD')).toJSON() : params[index]) + '&';
        }
    });    
    return axios.get(API+'/api/services/app/UserAssetDrawingApply/GetDrawingApplyListToExcel?'+input).then(res => res.data).catch(error => {
        Modal.error({
            title: error.response.data.error.message,
            content: error.response.data.error.details,
            centered: true
        });
    }); 
};
export const drawingApplyUpdateStatus = params => { return axios.put(API+'/api/services/app/UserAssetDrawingApply/UpdateStatus', params).then(res => res.data).catch(error => {
    Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
        centered: true
    });
});  }


// DropDownData 公共接口
export const getOilCardType = () => { return axios.get(API+'/api/services/app/DropDownData/GetOilCardType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getOilCardLoadStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetOilCardLoadStatus').then(res => res.data) }
export const getOilCardOrderApplyStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetOilCardOrderApplyStatus').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getDrawingStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetDrawingStatus').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getUserGrade = () => { return axios.get(API+'/api/services/app/DropDownData/GetUserGrade').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getAgentGrade = () => { return axios.get(API+'/api/services/app/DropDownData/GetAgentGrade').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getCommissionType = () => { return axios.get(API+'/api/services/app/DropDownData/GetCommissionType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getSalePlanType = () => { return axios.get(API+'/api/services/app/DropDownData/GetSalePlanType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getCommonStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetCommonStatus').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getCouponPlanType = () => { return axios.get(API+'/api/services/app/DropDownData/GetCouponPlanType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getCouponPlanScopeType = () => { return axios.get(API+'/api/services/app/DropDownData/GetCouponPlanScopeType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getSalesPlan = () => { return axios.get(API+'/api/services/app/DropDownData/GetSalesPlan').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getUserCouponStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetUserCouponStatus').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getGiftPackagePlan = () => { return axios.get(API+'/api/services/app/DropDownData/GetGiftPackagePlan').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getTransationType = () => { return axios.get(API+'/api/services/app/DropDownData/GetTransationType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getPointReleasesChargeType = () => { return axios.get(API+'/api/services/app/DropDownData/GetPointReleasesChargeType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getFreeUserGrade = () => { return axios.get(API+'/api/services/app/DropDownData/GetFreeUserGrade').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getOilCardApplyStatus = () => { return axios.get(API+'/api/services/app/DropDownData/GetOilCardApplyStatus').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getBusinessSchoolLeader = () => { return axios.get(API+'/api/services/app/DropDownData/GetBusinessSchoolLeader').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getScalableUserGrade = () => { return axios.get(API+'/api/services/app/DropDownData/GetScalableUserGrade').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};
export const getOrderType = () => { return axios.get(API+'/api/services/app/DropDownData/GetOrderType').then(res => res.data).catch(error => {Modal.error({title: error.response.data.error.message,content: error.response.data.error.details,centered: true})})};


export default API;