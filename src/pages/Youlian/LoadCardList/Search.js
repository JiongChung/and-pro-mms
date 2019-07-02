import React, { Component } from 'react';
import { getOilCardType, getOilCardLoadStatus, getLoadCardRechargeToExcel, downloadTempFile } from '../../../api/Api';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
const Option = Select.Option;

export default class LoadCardListSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            excelLoading: false,
            oilCardTypeList: [],
            oilCardLoadStatusList: [],
            params: {
                InviteCode: '',
                PhoneNumber: '',
                OilCardNo: '',
                LoadFromDate: '',
                LoadToDate: '',
                Status: '',
                OilCardTypeId: ''
            }
        };
    }

    componentWillMount() {
        this.getOilCardType();
        this.getOilCardLoadStatus();
    }

    getOilCardType(){
        getOilCardType().then(data => {
            this.setState({
                oilCardTypeList: data.result
            });
        })
    }

    getOilCardLoadStatus(){
        getOilCardLoadStatus().then(data => {
            this.setState({
                oilCardLoadStatusList: data.result
            })
        })
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
        getLoadCardRechargeToExcel(
            this.state.params.InviteCode ? this.state.params.InviteCode : undefined,
            this.state.params.PhoneNumber ? this.state.params.PhoneNumber : undefined,
            this.state.params.OilCardNo ? this.state.params.OilCardNo : undefined,
            this.state.params.LoadFromDate ? this.state.params.LoadFromDate : undefined,
            this.state.params.LoadToDate ? this.state.params.LoadToDate : undefined,
            this.state.params.Status ? this.state.params.Status : undefined,
            this.state.params.OilCardTypeId ? this.state.params.OilCardTypeId : undefined,
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
                    <Col span={6}>
                        <label className="labelTitle">用户ID</label>
                        <Input onKeyUp={(e) => this.handleValueChange('InviteCode', e.target.value.trim())} placeholder="请输入用户ID" />
                    </Col>
                    <Col span={6}>
                        <label className="labelTitle">用户手机</label>
                        <Input onKeyUp={(e) => this.handleValueChange('PhoneNumber', e.target.value.trim())} placeholder="请输入用户手机" />
                    </Col>
                    <Col span={6}>
                        <label className="labelTitle">充值卡号</label>
                        <Input onKeyUp={(e) => this.handleValueChange('OilCardNo', e.target.value.trim())} placeholder="请输入充值卡号" />
                    </Col>
                    <Col span={6}>
                        <label className="labelTitle">充值卡类型</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('OilCardTypeId', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.oilCardTypeList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6}>
                        <label className="labelTitle">圈存状态</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('Status', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.oilCardLoadStatusList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={6}>
                        <label className="labelTitle">圈存时间</label>
                        <DatePicker onChange={(e) => this.handleValueChange('LoadFromDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
                    </Col>
                    <Col span={6}>
                        <label className="labelTitle">至</label>
                        <DatePicker onChange={(e) => this.handleValueChange('LoadToDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
                    </Col>
                    <Col span={6} style={{marginTop: 22}}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>搜索</Button>
                        <Button icon="file-excel" onClick={this.getExcel} loading={this.state.excelLoading}>导出到Excel</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}