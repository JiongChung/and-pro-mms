import React, { Component } from 'react';
import { Tag, Button, Pagination, Spin } from 'antd';
import { getChargeList } from '../../../api/Api';
import { numberIntercept } from '../../../services/NumberIntercept';
import { dateFormat } from '../../../services/Dateformat';
import CommonServices from '../../../services/CommonServices';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Search from './Search';
import CreateOrEditModal from './CreateOrEditModal';

export default class ChargeListPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            params: {
                InviteCode: '',
                PhoneNumber: '',
                NickName: '',
                UserGradeId: '',
                AgentGradeId: '',
                PayMethod: '',
                ChargeType: '',
                Status: '',
                OilCardTypeId: '',
                PayFromDate: '',
                PayToDate: ''
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
        this.getChargeList();
    }

    getChargeList(){
        this.setState({loading: true});
        const { params, MaxResultCount, SkipCount } = this.state;
        getChargeList(
            params.InviteCode ? params.InviteCode : undefined,
            params.PhoneNumber ? params.PhoneNumber : undefined,
            params.NickName ? params.NickName : undefined,
            params.UserGradeId ? params.UserGradeId : undefined,
            params.AgentGradeId ? params.AgentGradeId : undefined,
            params.PayMethod ? params.PayMethod : undefined,
            params.ChargeType ? params.ChargeType : undefined,
            params.Status ? params.Status : undefined,
            params.OilCardTypeId ? params.OilCardTypeId : undefined,
            params.PayFromDate ? params.PayFromDate : undefined,
            params.PayToDate ? params.PayToDate : undefined,
            MaxResultCount,
            SkipCount
        ).then(data => {
            let tableData = data.result.items;
            for(let i=0; i<data.result.items.length; i++){
                tableData[i].serialnumber = i + 1 + this.state.currentPageTotal;
            }
            this.setState({
                tableData: tableData,
                totalCount: data.result.totalCount,
                loading: false
            });
        })
        .catch(err => console.log(err));
    }

    onCurrentPage = (current, pageSize) => {
        this.setState({
            SkipCount: this.state.MaxResultCount * (current - 1),
            MaxResultCount: pageSize,
            current: current
        },() => this.getChargeList());
    }

    onShowSize = (current, pageSize) => {
        let count = this.state.MaxResultCount + this.state.SkipCount;
        this.setState({
            MaxResultCount: pageSize,
            current: Math.ceil(count/pageSize)
        },() => this.onCurrentPage(Math.ceil(count/pageSize), pageSize));
    }

    formatNickName = (val) =>{
        return (val.length > 6) ? ((val.length == 11) ? (!CommonServices.phone(val) ? val.substr(0,6) + '...' : val) :  val.substr(0,6) + '...') : val;
    }

    getSearchData = (data) =>{
        this.setState({
            params: data
        },() => this.onCurrentPage(1, this.state.MaxResultCount))
    }

    showModal = (id) => {
        this.showModal(id);
    }

    render(){
        const { current, MaxResultCount, totalCount, loading, tableData } = this.state;
        return(
            <PageHeaderWrapper title="交费列表" content={'共'+totalCount+'条记录'}>
            <div className="main-content-item">
                <Search listenSearch={this.getSearchData} props={this.props} />
                <div className="list-item">
                    {/* <div className="count">
                        <span>共{totalCount}条记录</span>
                    </div> */}
                    <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <th style={{width: '50px'}}>#</th>
                                <th>订单号码</th>
                                <th>用户信息</th>
                                <th>用户等级</th>
                                <th>充值金额</th>
                                <th>支付金额</th>
                                <th>佣金</th>
                                <th>支付信息</th>
                                <th>充值类型</th>
                                <th>下单时间</th>
                                <th>订单状态</th>
                                <th>操作</th>
                            </tr>
                            {
                                tableData.map((record, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{record.serialnumber}</td>
                                            <td>{numberIntercept(record.chargeNo)}</td>
                                            <td>
                                                ID：{record.inviteCode}
                                                <br />
                                                昵称：{this.formatNickName(record.nickName)}
                                                <br />
                                                手机：{record.phoneNumber}
                                            </td>
                                            <td>
                                                {record.userGradeName}
                                                {
                                                    (record.agentDistrictName && record.agentGradeId !== 4) ? 
                                                    <div>
                                                        {record.agentDistrictName ? <div><Tag color="blue">{record.agentDistrictName}</Tag></div>: ''}
                                                        {(record.agentGradeName || record.agentGradeId === 4) ? <div><Tag color="blue">{record.agentGradeName}</Tag></div> : ''}
                                                        {record.agentGradeId === 4 ? <Tag color="gold">全国合伙人</Tag> : ''}
                                                    </div> : ''
                                                }
                                                
                                                {
                                                    record.branchAgent ? 
                                                    <div>
                                                        {record.branchAgent ? <div><Tag color="orange">{record.branchAgent}</Tag></div> : ''}
                                                        {record.subBranchAgent ? <div><Tag color="orange">{record.subBranchAgent}</Tag></div> : ''}                                                        
                                                    </div> : ''
                                                }                                                
                                            </td>
                                            <td>{record.chargeAmount}</td>
                                            <td>{record.payAmount}{(record.payAmount === null) ? '-' : ''}</td>
                                            <td>{record.commissionAmount}</td>
                                            <td>
                                                {record.payMethodName ? record.payMethodName + '支付' : ''}<br />
                                                {record.payTransactionNo ? '单号：' + numberIntercept(record.payTransactionNo) : ''}<br />
                                                {dateFormat(record.payTime,'YYYY-MM-DD HH:mm:ss')}
                                            </td>
                                            <td>
                                                {record.chargeTypeName}<br />
                                                {(record.chargeType !== 2 && record.chargeSalePlanName) ? <Tag color="blue">{record.chargeSalePlanName}</Tag> : ''}
                                                {record.oilCardNo ? '卡号：' + numberIntercept(record.oilCardNo, 11) + ' ' : ''}
                                                {record.oilCardTypeName ? <Tag color="blue">{record.oilCardTypeName}</Tag> : ''}
                                            </td>
                                            <td>{dateFormat(record.createdTime, 'YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>
                                                {(record.status === 1 && record.statusName) ? <Tag color="#ed6b75">{record.statusName}</Tag> : ''}
                                                {(record.status === 2 && record.statusName) ? <Tag color="#36c6d3">{record.statusName}</Tag> : ''}
                                                {(record.status === 3 && record.statusName) ? <Tag color="#F1C40F">{record.statusName}</Tag> : ''}
                                                {(record.status === 4 && record.statusName) ? <Tag color="#36c6d3">{record.statusName}</Tag> : ''}
                                                {(record.status === 5 && record.statusName) ? <Tag color="#ed6b75">{record.statusName}</Tag> : ''}
                                                {(record.status === 6 && record.statusName) ? <Tag color="#F1C40F">{record.statusName}</Tag> : ''}
                                            </td>
                                            <td><Button size="small" onClick={() => this.showModal(record.id)}>查看</Button></td>
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
                <CreateOrEditModal modalSave={() => this.getChargeList()} showModal={fn=> { this.showModal = fn; }} tableData={tableData} ref={"CreateOrEditModal"} />
            </div>
            </PageHeaderWrapper>
        )
    }
}