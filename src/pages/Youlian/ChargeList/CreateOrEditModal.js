import React,{Component} from 'react';
import { Modal, Button, Form, Input, Radio, notification  } from 'antd';
import { dateFormat } from '../../../services/Dateformat';
import { deleteCharge } from '../../../api/Api';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const openNotificationWithIcon = (type) => {
    notification.config({
        placement: 'bottomRight',
        duration: 3
    });
    notification[type]({
        message: '删除成功！'
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
            createOrEditParameter: {}
        };
    }

    showModal = (viewid) =>{
        this.setState({
            visible: true,
            title: '查看交费记录',
            createOrEditParameter: this.props.tableData.filter(item => item.id === viewid)[0]
        });
    }

    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }
    
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    remove = () => {
        let _this = this;
        confirm({
            title: '你确定要删除所选记录？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.deleteCharge();
            }
        });
    }

    deleteCharge = () => {
        this.setState({confirmLoading: true});
        deleteCharge(this.state.createOrEditParameter.id).then(() => {
            openNotificationWithIcon('success');
            this.setState({
                confirmLoading: false,
                visible: false
            });
            this.props.modalSave();
        });        
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { title, visible, confirmLoading, createOrEditParameter} = this.state;
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
        if(createOrEditParameter.status === 3){
            footer = <div><Button onClick={this.handleCancel}>取消</Button><Button type="danger" icon="close" loading={confirmLoading} onClick={this.remove}>删除</Button></div>;
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
                onCancel={this.handleCancel}
                destroyOnClose
                footer={footer}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit} className="createOrEditForm">
                    <FormItem label="昵称">
                        {getFieldDecorator('nickName', {
                            initialValue: createOrEditParameter.nickName || ''
                        })(
                            <Input disabled placeholder="请输入昵称" />
                        )}
                        
                    </FormItem>
                    <FormItem label="手机">
                        <Input disabled value={createOrEditParameter.phoneNumber} placeholder="请输入手机" />
                    </FormItem>
                    <FormItem label="充值金额">
                        <Input disabled value={createOrEditParameter.chargeAmount} placeholder="请输入充值金额" />
                    </FormItem>
                    <FormItem label="订单号">
                        <Input disabled value={createOrEditParameter.chargeNo} placeholder="请输入订单号" />
                    </FormItem>
                    <FormItem label="会员等级">
                        <Input disabled value={createOrEditParameter.userGradeName} placeholder="请输入会员等级" />
                    </FormItem>
                    <FormItem label="充值方案">
                        <Input disabled value={createOrEditParameter.chargeTypeName} placeholder="请输入充值方案" />
                    </FormItem>
                    <FormItem label="充值卡号">
                        <Input disabled value={createOrEditParameter.oilCardNo} placeholder="请输入充值卡号" />
                    </FormItem>
                    <FormItem label="充值卡类型">
                        <Input disabled value={createOrEditParameter.oilCardTypeName} placeholder="请输入充值卡类型" />
                    </FormItem>
                    <FormItem label="购买时间">
                        <Input disabled value={dateFormat(createOrEditParameter.payTime,'YYYY-MM-DD HH:mm:ss')} placeholder="请输入购买时间" />
                    </FormItem>
                    <FormItem label="购买方式">
                        <Input disabled value={createOrEditParameter.payMethodName} placeholder="请输入购买方式" />
                    </FormItem>
                    <FormItem label="第三方单号">
                        <Input disabled value={createOrEditParameter.payTransactionNo} placeholder="请输入第三方单号" />
                    </FormItem>
                    <FormItem label="订单状态">
                        <RadioGroup disabled value={createOrEditParameter.status}>
                            <Radio value={1}>待发货</Radio>
                            <Radio value={2}>已完成</Radio>
                            <Radio value={3}>待支付</Radio>
                            <Radio value={4}>已收货</Radio>
                            <Radio value={5}>已取消</Radio>
                            <Radio value={6}>已退款</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(CreateOrEditModal);