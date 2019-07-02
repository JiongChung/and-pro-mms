import React, { Component } from 'react';
import { Modal, notification, Tag, Button, Pagination, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getLoadCardList, loadCardUpdateStatus, rechargeOilCard } from '../../../api/Api';
import { dateFormat } from '../../../services/Dateformat';
import Search from './Search';
import CreateOrEditModal from './CreateOrEditModal';
const confirm = Modal.confirm;
const openNotificationWithIcon = (type) => {
    notification.config({
        placement: 'bottomRight',
        duration: 3
    });
    notification[type]({
        message: '圈存成功！'
    });
};

export default class LoadCardListPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            params: {
                InviteCode: '',
                PhoneNumber: '',
                OilCardNo: '',
                LoadFromDate: '',
                LoadToDate: '',
                Status: '',
                OilCardTypeId: ''
            },
            MaxResultCount: 10,
            SkipCount: 0,
            current: 1,
            totalCount: 0,
            currentPageTotal: 0,
            loading: false
        };
    }

    componentDidMount(){
        this.getLoadCardList();
    }

    getLoadCardList(){
        this.setState({loading: true});
        const { params, MaxResultCount, SkipCount } = this.state;
        getLoadCardList(
            params.InviteCode ? params.InviteCode : undefined,
            params.PhoneNumber ? params.PhoneNumber : undefined,
            params.OilCardNo ? params.OilCardNo : undefined,
            params.LoadFromDate ? params.LoadFromDate : undefined,
            params.LoadToDate ? params.LoadToDate : undefined,
            params.Status ? params.Status : undefined,
            params.OilCardTypeId ? params.OilCardTypeId : undefined,
            MaxResultCount,
            SkipCount
        )
        .then(data => {
            if(data){
                let tableData = data.result.items;
                for(let i=0; i<data.result.items.length; i++){
                    tableData[i].serialnumber = i + 1 + this.state.currentPageTotal;
                }
                this.setState({
                    tableData: tableData,
                    totalCount: data.result.totalCount,
                    loading: false
                });
            }
        })
        .catch(err => console.log(err));
    }

    onCurrentPage = (current, pageSize) => {
        this.setState({
            SkipCount: this.state.MaxResultCount * (current - 1),
            MaxResultCount: pageSize,
            current: current
        },() => this.getLoadCardList());
    }

    onShowSize = (current, pageSize) => {
        let count = this.state.MaxResultCount + this.state.SkipCount;
        this.setState({
            MaxResultCount: pageSize,
            current: Math.ceil(count/pageSize)
        },() => this.onCurrentPage(Math.ceil(count/pageSize), pageSize));
    }

    getSearchData = (data) =>{
        this.setState({
            params: data
        },() => this.onCurrentPage(1, this.state.MaxResultCount))
    }

    showModal = (id) => {
        this.showModal(id);
    }

    rechargeNow = (id, oilCardTypeId, oilCardNo, approvalRemark) => {
        let input = {};
        input.id = id;
        input.status = 2;
        input.approvalRemark = approvalRemark;
        input.oilCardType = oilCardTypeId;
        input.oilCardNo = oilCardNo;

        let _this = this;
        confirm({
            title: '你确定要圈存？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                console.log('yeah')
            }
        });
    }

    rechargeOilCard = (id) => {
        let input = {};
        input.id = id;
        let _this = this;
        confirm({
            title: '你确定要通过聚合圈存这个充值卡？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                console.log('yeah')
            }
        });
    }

    render(){
        const { current, MaxResultCount, totalCount, loading, tableData } = this.state;
        return(
            <PageHeaderWrapper title="油卡圈存" content={'共'+totalCount+'条记录'}>
                <div className="main-content-item">
                    <Search listenSearch={this.getSearchData} props={this.props} />
                    <div className="list-item">
                        <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                            <tbody>
                                <tr>
                                    <th style={{width: '50px'}}>#</th>
                                    <th>用户ID</th>
                                    <th>用户昵称</th>
                                    <th>手机号码</th>
                                    <th>充值卡号类型</th>
                                    <th>充值卡号</th>
                                    <th>即时充值</th>
                                    <th>充值金额</th>
                                    <th>油豆消耗</th>
                                    <th>佣金消耗</th>
                                    <th>提交时间</th>
                                    <th>充值状态</th>
                                    <th>操作</th>
                                </tr>
                                {
                                    tableData.map((record, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{record.serialnumber}</td>
                                                <td>{record.inviteCode}</td>
                                                <td>{record.nickName}</td>
                                                <td>{record.phoneNumber}</td>
                                                <td>
                                                    {(record.oilCardTypeId === 1) ? '中石油' : ((record.oilCardTypeId === 2) ? '中石化' : '欧粤新能源')}
                                                </td>
                                                <td>{record.oilCardNo}</td>
                                                <td>{record.isRealTimeRecharge ? '是' : ''}</td>
                                                <td>{record.loadAmount}</td>
                                                <td>{record.usedPoints ? record.usedPoints : '0'}</td>
                                                <td>{record.usedCommissionAmount ? record.usedCommissionAmount : '0'}</td>
                                                <td>{dateFormat(record.loadTime,'YYYY-MM-DD HH:mm:ss')}</td>
                                                <td>
                                                    {(record.status === 1) ? <Tag color="magenta">待处理</Tag> : ''}
                                                    {(record.status === 2) ? <Tag color="blue">圈存成功</Tag> : ''}
                                                    {(record.status === 3) ? <Tag color="red">圈存取消</Tag> : ''}
                                                    {(record.status === 4) ? <Tag color="orange">充值中</Tag> : ''}
                                                    {(record.status === 5) ? <Tag color="red">圈存失败</Tag> : ''}
                                                </td>
                                                <td>
                                                    {(record.status === 1 || record.status === 5) ? <Button size="small" onClick={() => this.showModal(record.id)}>编辑</Button>  : ''}
                                                    {(record.status === 1 || record.status === 5) ? <Button size="small" onClick={() => this.rechargeNow(record.id, record.oilCardTypeId, record.oilCardNo, record.approvalRemark)} type="primary">手工圈存</Button>  : ''}
                                                    {(record.status === 1 || record.status === 5) ? <Button size="small" onClick={() => this.rechargeOilCard(record.id)} type="primary">聚合充值</Button> : ''}
                                                    {(record.status > 1 &&  record.status !== 5) ? <Button size="small" onClick={() => this.showModal(record.id)}>查看</Button> : ''}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="page-item clearfix">
                            <span className="totalCount">Total: {totalCount}</span>
                            <Pagination 
                                showSizeChanger 
                                current={current}
                                onShowSizeChange={this.onShowSize}
                                onChange={this.onCurrentPage} 
                                pageSize={MaxResultCount} 
                                pageSizeOptions={['5', '10', '25', '50', '100', '200','500']}
                                total={totalCount} />
                        </div>
                        {loading ? <div className="loadingModal"><Spin size="large" spinning={loading}></Spin></div> : ''}
                    </div>
                    <CreateOrEditModal modalSave={() => this.getLoadCardList()} showModal={fn=> { this.showModal = fn; }} tableData={tableData} ref={"CreateOrEditModal"} />
                </div>
            </PageHeaderWrapper>
        )
    }
}