import React,{ Component } from 'react';
import { Modal, Button, Form, Input, Radio, notification } from 'antd';
import { drawingApplyUpdateStatus } from '../../../api/Api';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
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
            Status: false
        };
    }

    showModal = (viewid) =>{
        this.setState({
            visible: true,
            title: '查看提现申请记录',
            createOrEditParameter: this.props.tableData.filter(item => item.id === viewid)[0]
        },() => {
            this.setState({
                Status: (this.state.createOrEditParameter.status === 1) ? false : true
            })
        });
        this.checkFormValid();        
    }

    handleCancel = () => this.setState({visible: false});

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({confirmLoading: true});
        drawingApplyUpdateStatus(this.state.createOrEditParameter).then(() => {
            openNotificationWithIcon('success');
            this.setState({
                confirmLoading: false,
                visible: false
            });
            this.props.modalSave();
        })
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
        const { getFieldDecorator } = this.props.form;
        const { title, visible, confirmLoading, createOrEditParameter, isCanSave, Status} = this.state;
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
        if(!Status){
            footer = <div><Button onClick={this.handleCancel}>取消</Button><Button type="primary" disabled={!isCanSave} icon="save" onClick={this.handleSubmit} loading={confirmLoading}>保存</Button></div>;
        }else{
            footer = <Button onClick={this.handleCancel}>取消</Button>;
        }
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
                    <FormItem label="用户名称">
                        <Input disabled value={createOrEditParameter.nickName} placeholder="请输入用户名称" />
                    </FormItem>
                    <FormItem label="提现金额">
                        <Input disabled value={createOrEditParameter.drawingAmount+'元'} placeholder="请输入提现金额" />
                    </FormItem>
                    <FormItem label="金额类型">
                        <Input disabled value={createOrEditParameter.assetTypeName} placeholder="请输入金额类型" />
                    </FormItem>
                    <FormItem label="提现手续费">
                        <Input disabled value={createOrEditParameter.handlingFee+'元'} placeholder="请输入提现手续费" />
                    </FormItem>
                    <FormItem label="提现手续费比例">
                        <Input disabled value={createOrEditParameter.handlingFeeRate+'%'} placeholder="请输入提现手续费比例" />
                    </FormItem>
                    <FormItem label="提现类型">
                        <Input disabled value={createOrEditParameter.returnTypeName} placeholder="请输入提现类型" />
                    </FormItem>
                    <FormItem label="银行卡号">
                        <Input disabled value={createOrEditParameter.bankCardNo} placeholder="请输入银行卡号" />
                    </FormItem>
                    <FormItem label="提现银行">
                        <Input disabled value={createOrEditParameter.bankCardName} placeholder="请输入提现银行" />
                    </FormItem>
                    <FormItem label="银行卡开户姓名">
                        <Input disabled value={createOrEditParameter.bankCardUserName} placeholder="请输入银行卡开户姓名" />
                    </FormItem>
                    <FormItem label="充值状态">                       
                        <RadioGroup onChange={this.onChange} disabled={Status} value={createOrEditParameter.status}>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>取消申请</Radio>
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