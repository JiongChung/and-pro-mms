import React, {Component} from 'react';
import { getDrawingStatus, getDrawingApplyListToExcel, downloadTempFile } from '../../../api/Api';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
const Option = Select.Option;

export default class DrawingApplyListSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            excelLoading: false,
            drawingStatusList: [],
            params: {
                InviteCode: '',
                PhoneNumber: '',
                Status: '',
                DrawingFromDate: '',
                DrawingToDate: ''
            }
        };
    }

    componentWillMount(){
        this.getDrawingStatus();
    }

    getDrawingStatus(){
        getDrawingStatus().then(data => {
            this.setState({
                drawingStatusList: data.result
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
        getDrawingApplyListToExcel(
            this.state.params.InviteCode ? this.state.params.InviteCode : undefined,
            this.state.params.PhoneNumber ? this.state.params.PhoneNumber : undefined,
            this.state.params.Status ? this.state.params.Status : undefined,
            this.state.params.DrawingFromDate ? this.state.params.DrawingFromDate : undefined,
            this.state.params.DrawingToDate ? this.state.params.DrawingToDate : undefined,
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
                        <label className="labelTitle">用户电话</label>
                        <Input onKeyUp={(e) => this.handleValueChange('PhoneNumber', e.target.value.trim())} placeholder="请输入收货人电话" />
                    </Col>
                    <Col span={4}>
                        <label className="labelTitle">提现状态</label>
                        <Select defaultValue="全部" onChange={(e) => this.handleValueChange('Status', e)} style={{ width: '100%' }}>
                            <Option value="">全部</Option>
                            {
                                this.state.drawingStatusList.map((item, key) => {
                                    return <Option value={item.id} key={key}>{item.value}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <label className="labelTitle">申请时间</label>
                        <DatePicker onChange={(e) => this.handleValueChange('DrawingFromDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
                    </Col>
                    <Col span={4}>
                        <label className="labelTitle">至</label>
                        <DatePicker onChange={(e) => this.handleValueChange('DrawingToDate', e)} placeholder="请选择日期" style={{ width: '100%' }} />
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