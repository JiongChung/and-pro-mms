import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import HttpService from '../../services/HttpService';
import { Alert, message, Icon } from 'antd';
import API from '../../api/Api';
import CommonServices from '../../services/CommonServices';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            type: 'account'
        };
    }

    componentDidMount(){
        console.log(decodeURIComponent(window.location.href.split('?')[1].split('=')[1]));
    }

    handleSubmit = (err, values) => {
        let api = API + '/api/TokenAuth/Authenticate';
        HttpService.post(api, values)
        .then(data => this.setCookie(data.result))
        .catch(err => {
           console.log(err)
        })
    };

    setCookie = (result) => {
        const url = window.location.href.split('?')[1].split('=')[1];
        CommonServices.setCookie('Abp.AuthToken',result.accessToken);
        CommonServices.setCookie('enc_auth_token',result.encryptedAccessToken);
        window.location.href = decodeURIComponent(url);
        // this.props.history.push(url)
    }

    renderMessage = content => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );

    render() {
        const { login, submitting } = this.props;
        const { type } = this.state;
        return (
            <div className={styles.main}>
                <Login
                    defaultActiveKey={type}
                    onSubmit={this.handleSubmit}
                    ref={form => {
                        this.loginForm = form;
                    }}
                >
                    {login.status === 'error' &&
                    login.type === 'account' &&
                    !submitting &&
                    this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
                    <UserName
                        name="userNameOrEmailAddress"
                        placeholder={`${formatMessage({ id: 'app.login.userName' })}: admin or user`}
                        rules={[
                            {
                            required: true,
                            message: formatMessage({ id: 'validation.userName.required' }),
                            },
                        ]}
                    />
                    <Password
                        name="password"
                        placeholder={`${formatMessage({ id: 'app.login.password' })}: ant.design`}
                        rules={[
                            {
                            required: true,
                            message: formatMessage({ id: 'validation.password.required' }),
                            },
                        ]}
                        onPressEnter={e => {
                            e.preventDefault();
                            this.loginForm.validateFields(this.handleSubmit);
                        }}
                    />
                <Submit loading={submitting}>
                    <FormattedMessage id="app.login.login" />
                </Submit>
                </Login>
            </div>
        );
    }
}

export default LoginPage;
