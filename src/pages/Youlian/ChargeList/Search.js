import React, {Component} from 'react';
import { getChargeListInit, getUserRechargeToExcel, downloadTempFile } from '../../../api/Api';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
const Option = Select.Option;

export default class ChargeListPageSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            excelLoading: false,
            userGradeList: [],
            agentGradeList: [],
            payMethodList: [],
            chargeTypeList: [],
            chargeStatusList: [],
            oilCardTypeList: [],
            params: {
                InviteCode: '',
                NickName: '',
                PhoneNumber: '',
                UserGradeId: '',
                AgentGradeId: '',
                PayMethod: '',
                ChargeType: '',
                Status: '',
                OilCardTypeId: '',
                PayFromDate: '',
                PayToDate: ''
            }
        };
    }

    componentWillMount(){
        this.getChargeListInit();
    }

    getChargeListInit(){
        getChargeListInit().then(data => {
            this.setState({
                userGradeList: data.result.userGrade,
                agentGradeList: data.result.agentGrade,
                payMethodList: data.result.payMethod,
                chargeTypeList: data.result.chargeType,
                chargeStatusList: data.result.chargeStatus,
                oilCardTypeList: data.result.oilCardType
            })
        });
    }

    handleValueChange(field, value) {
        let data = this.state.params;
        data[field] = value;
        this.setState({
            params: data
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.listenSearch(this.state.params);
    }

    getExcel = () => {
        getUserRechargeToExcel(
            this.state.params.InviteCode ? this.state.params.InviteCode : undefined,
            this.state.params.PhoneNumber ? this.state.params.PhoneNumber : undefined,
            this.state.params.NickName ? this.state.params.NickName : undefined,
            this.state.params.UserGradeId ? this.state.params.UserGradeId : undefined,
            this.state.params.AgentGradeId ? this.state.params.AgentGradeId : undefined,
            this.state.params.PayMethod ? this.state.params.PayMethod : undefined,
            this.state.params.ChargeType ? this.state.params.ChargeType : undefined,
            this.state.params.Status ? this.state.params.Status : undefined,
            this.state.params.OilCardTypeId ? this.state.params.OilCardTypeId : undefined,
            this.state.params.PayFromDate ? this.state.params.PayFromDate : undefined,
            this.state.params.PayToDate ? this.state.params.PayToDate : undefined,
            1,
            0
        )
        .then(data => {
            downloadTempFile(data.result);
        })
        .catch(err => console.log(err));
    }

    render(){
        return(
            <Form onSubmit={this.handleSearch} layout="inline" className="ant-search-form-item">
                <Row gutter={24}>
                    <Col span={4}>
                        <label className="labelTitle">用户ID</label>
                        <Input onKeyUp={(e) => this.handleValueChange('InviteCode', e.target.value.trim())} placeholder="请输入用户ID" />
                    </Col>
                    <Col span={4}>
                        <label className="labelTitle">用户昵称</label>
                        <Input onKeyUp={(e) => this.handleValueChange('NickName', e.target.value.trim())} placeholder="请输入用户昵称" />
                    </Col>
                    <Col span={4}>
                        <label className="labelTitle">用户手机</label>
                        <Input onKeyUp={(e) => this.handleValueChange('PhoneNumber', e.target.value.trim())} placeholder="请输入用户手机" />
                    </Col>
                    <Col span={4}>
                        <label>会员等级</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('UserGradeId', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.userGradeList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>合伙人等级</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('AgentGradeId', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.agentGradeList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>支付方式</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('PayMethod', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.payMethodList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={4}>
                        <label>充值类型</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('ChargeType', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.chargeTypeList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>充值状态</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('Status', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.chargeStatusList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>油卡类型</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('OilCardTypeId', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.oilCardTypeList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label>交费时间</label>
                        <DatePicker onChange={(e) => this.handleValueChange('PayFromDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
                    </Col>
                    <Col span={4}>
                        <label>至</label>
                        <DatePicker onChange={(e) => this.handleValueChange('PayToDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
                    </Col>
                    <Col span={4} style={{marginTop: 22}}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>搜索</Button>
                        <Button icon="file-excel" onClick={this.getExcel} loading={this.state.excelLoading}>导出到Excel</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}