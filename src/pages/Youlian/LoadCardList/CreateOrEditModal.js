import React,{ Component } from 'react';
import { Modal, Button, Form, Input, Radio, notification, Select, Tag } from 'antd';
import { loadCardUpdateStatus, getLoadCardRemartForEdit } from '../../../api/Api';
import { numberIntercept } from '../../../services/NumberIntercept';
import { dateFormat } from '../../../services/Dateformat';
// import './createoreditmodal.css';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;
const openNotificationWithIcon = (type) => {
    notification.config({
        placement: 'bottomRight',
        duration: 3
    });
    notification[type]({
        message: '保存成功！'
    });
};

class CreateOrEditModal extends Component {
    constructor(props){
        super(props);
        props.showModal(this.showModal);
        this.state = {
            title:'',
            visible: false,
            confirmLoading: false,
            createOrEditParameter: {},
            isCanSave: false,
            status: false,
            listOilRechargeCardDetail: []
        };
    }

    showModal = (viewid) =>{
        this.setState({
            visible: true,
            title: '查看圈存记录',
            createOrEditParameter: this.props.tableData.filter(item => item.id === viewid)[0]
        },() => {
            (this.state.createOrEditParameter.status > 1 && this.state.createOrEditParameter.status !== 5) ? this.setState({status: true}) : this.setState({status: false});
            this.getLoadCardRemartForEdit(this.state.createOrEditParameter.id);
        });
        this.checkFormValid();        
    }
    getLoadCardRemartForEdit = (id) => {
        getLoadCardRemartForEdit(id).then(data => this.setState({listOilRechargeCardDetail: data.result.listOilRechargeCardDetail}));
    }
    
    handleCancel = () => this.setState({visible: false});

    handleSubmit = (e) => {
        e.preventDefault();
        let input = {};
        input.id = this.state.createOrEditParameter.id;
        input.status = this.state.createOrEditParameter.status;
        input.oilCardType = this.state.createOrEditParameter.oilCardTypeId;
        input.oilCardNo = this.state.createOrEditParameter.oilCardNo;
        input.approvalRemark = this.state.createOrEditParameter.approvalRemark;
        

        if(input.status === 1){
            this.setState({confirmLoading: true});
            loadCardUpdateStatus(input).then(() => {
                openNotificationWithIcon('success');
                this.setState({
                    confirmLoading: false,
                    visible: false
                });
                this.props.modalSave();
            })
        }else{
            if(input.status === 5){
                Modal.warning({
                    title: '不能以圈存失败状态保存数据',
                    centered: true
                });
                return false;
            }
            let _this = this;
            confirm({
                title: '你确定要圈存？',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk() {
                    _this.setState({confirmLoading: true});
                    loadCardUpdateStatus(input).then(data => {
                        if(data){
                            openNotificationWithIcon('success');
                            _this.setState({
                                confirmLoading: false,
                                visible: false
                            });
                            _this.props.modalSave();
                        }else{
                            _this.setState({confirmLoading: false})
                        }
                    });
                }
            });
        }
    }

    checkFormValid = () => {
        setTimeout(() => {
            this.props.form.validateFields((err,values)=>{
                (err === null) ? this.setState({isCanSave: true}) : this.setState({isCanSave: false});
            });
        });
    }

    onChange = (e) => {
        let createOrEditParameter = this.state.createOrEditParameter;
        createOrEditParameter.status = e.target.value;
        this.setState({
            createOrEditParameter: createOrEditParameter
        });
    }

    handleValueChange(field, value) {
        let data = this.state.createOrEditParameter;
        data[field] = value;
        this.setState({
            createOrEditParameter: data
        });
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const { title, visible, confirmLoading, createOrEditParameter, isCanSave, status, listOilRechargeCardDetail} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        let footer = '';
        if(!status){
            footer = <div><Button onClick={this.handleCancel}>取消</Button><Button type="primary" disabled={!isCanSave} icon="save" onClick={this.handleSubmit} loading={confirmLoading}>保存</Button></div>;
        }else{
            footer = <Button onClick={this.handleCancel}>取消</Button>;
        }
        let oilCardText = (createOrEditParameter.oilCardTypeId === 1) ? '中石油' : ((createOrEditParameter.oilCardTypeId === 2) ? '中石化' : '欧粤新能源');

    

        return(
            <Modal
                className="createOrEditModal-item"
                title={title}
                style={{ top: 20 }}
                width={800}
                visible={visible}
                destroyOnClose
                onCancel={this.handleCancel}
                footer={footer}
            >
                <Form {...formItemLayout} className="createOrEditForm">
                    <FormItem label="昵称">
                        <Input disabled value={createOrEditParameter.nickName} placeholder="请输入昵称" />
                    </FormItem>
                    <FormItem label="手机">
                        <Input disabled value={createOrEditParameter.phoneNumber} placeholder="请输入手机" />
                    </FormItem>
                    {
                        !status ?
                        <div>
                            <FormItem label="充值卡号类型">
                                {getFieldDecorator('oilCardTypeId', {
                                    initialValue: createOrEditParameter.oilCardTypeId || ''
                                })(
                                    <Select onChange={(e) => this.handleValueChange('oilCardTypeId', e)}>
                                        <Option value={1}>中石油</Option>
                                        <Option value={2}>中石化</Option>
                                        <Option value={3}>欧粤新能源</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="充值卡号">
                                {getFieldDecorator('oilCardNo', {
                                    initialValue: createOrEditParameter.oilCardNo || '',
                                    rules:[
                                        {
                                            required: true,
                                            message: '请输入充值卡号'
                                        },
                                        {
                                            pattern:new RegExp(/^[1-9]*[1-9][0-9]*$/,'g'),
                                            message: '充值卡号必须正整数'
                                        }
                                    ]
                                })(
                                    <Input type="number" onKeyUp={(e) => this.handleValueChange('oilCardNo', e.target.value.trim())} onChange={this.checkFormValid} placeholder="请输入充值卡号" />
                                )}
                            </FormItem>
                        </div>
                        :
                        <div>
                            <FormItem label="充值卡号类型">
                                <Input disabled value={oilCardText} placeholder="请输入充值卡号类型" />
                            </FormItem>
                            <FormItem label="充值卡号">
                                <Input disabled value={createOrEditParameter.oilCardNo} placeholder="请输入充值卡号" />
                            </FormItem>
                        </div>
                    }
                    <FormItem label="充值金额">
                        <Input disabled value={createOrEditParameter.loadAmount} placeholder="请输入充值金额" />
                    </FormItem>
                    <FormItem label="油豆消耗">
                        <Input disabled value={createOrEditParameter.usedPoints} placeholder="请输入油豆消耗" />
                    </FormItem>
                    <FormItem label="佣金消耗">
                        <Input disabled value={createOrEditParameter.usedCommissionAmount} placeholder="请输入佣金消耗" />
                    </FormItem>
                    <FormItem label="充值状态">                       
                        <RadioGroup onChange={this.onChange} disabled={status} value={createOrEditParameter.status}>
                            <Radio value={1}>待处理</Radio>
                            <Radio value={2}>圈存成功</Radio>
                            <Radio value={3}>圈存取消</Radio>
                            <Radio disabled value={4}>充值中</Radio>
                            <Radio disabled value={5}>圈存失败</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="审批说明">
                        {getFieldDecorator('approvalRemark', {
                            initialValue: createOrEditParameter.approvalRemark || ''
                        })(
                            <TextArea onKeyUp={(e) => this.handleValueChange('approvalRemark', e.target.value.trim())} rows={2} placeholder="请输入审批说明" />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CreateOrEditModal);