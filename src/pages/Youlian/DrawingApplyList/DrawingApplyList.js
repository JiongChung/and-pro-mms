import React, { Component } from 'react';
import { Tag, Button, Pagination, Spin } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getDrawingApplyList } from '../../../api/Api';
import { dateFormat } from '../../../services/Dateformat';
import { numberIntercept } from '../../../services/NumberIntercept';
import Search from './Search';
import CreateOrEditModal from './CreateOrEditModal';

export default class DrawingApplyListPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            params: {
                InviteCode: '',
                PhoneNumber: '',
                Status: '',
                DrawingFromDate: '',
                DrawingToDate: ''
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
        this.getDrawingApplyList();
    }

    getDrawingApplyList() {
        const { params, MaxResultCount, SkipCount } = this.state;
        this.setState({loading: true});
        getDrawingApplyList(
            params.InviteCode ? params.InviteCode : undefined,
            params.PhoneNumber ? params.PhoneNumber : undefined,
            params.Status ? params.Status : undefined,
            params.DrawingFromDate ? params.DrawingFromDate : undefined,
            params.DrawingToDate ? params.DrawingToDate : undefined,
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
        },() => this.getDrawingApplyList());
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


    render(){
        const { current, MaxResultCount, totalCount, loading, tableData } = this.state;
        return(
            <PageHeaderWrapper title="提现申请" content={'共'+totalCount+'条记录'}>
                <div className="main-content-item">
                <Search listenSearch={this.getSearchData} props={this.props} />
                <div className="list-item">
                    <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <th style={{width: '50px'}}>#</th>
                                <th>用户信息</th>
                                <th>金额类型</th>
                                <th>当前金额</th>
                                <th>提现金额</th>
                                <th>提现手续费</th>
                                <th>手续费率(%)</th>
                                <th>实际划款</th>
                                <th>提现类型</th>
                                <th>银行卡信息</th>
                                <th>提现时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                            {
                                tableData.map((record, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{record.serialnumber}</td>
                                            <td>
                                                ID：{record.inviteCode}<br />
                                                昵称：{record.nickName}<br />
                                                手机：{record.phoneNumber}
                                            </td>
                                            <td>{record.assetTypeName}</td>
                                            <td>{record.remainingAmount}</td>
                                            <td>{record.drawingAmount}</td>
                                            <td>{record.handlingFee}</td>
                                            <td>{record.handlingFeeRate}</td>
                                            <td>{record.actualAmount}</td>
                                            <td>{record.returnTypeName}</td>
                                            <td>
                                                银行：{numberIntercept(record.bankCardName, 10)}<br />
                                                卡号：{record.bankCardNo}<br />
                                                户名：{record.bankCardUserName}
                                            </td>
                                            <td>{dateFormat(record.drawingTime, 'YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>
                                                {(record.status === 1) ? <Tag color="orange">{record.statusName}</Tag> : ''}
                                                {(record.status === 2) ? <Tag color="blue">{record.statusName}</Tag> : ''}
                                                {(record.status === 3) ? <Tag color="red">{record.statusName}</Tag> : ''}
                                            </td>
                                            <td>
                                                {
                                                    (record.status === 1) ? <Button size="small" type="primary" onClick={() => this.showModal(record.id)}>编辑</Button> : <Button size="small" onClick={() => this.showModal(record.id)}>查看</Button>
                                                }
                                                
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
                <CreateOrEditModal modalSave={() => this.getDrawingApplyList()} showModal={fn=> { this.showModal = fn; }} tableData={tableData} ref={"CreateOrEditModal"} />
            </div>
            </PageHeaderWrapper>
        )
    }
}