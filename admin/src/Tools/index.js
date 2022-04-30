import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined, MailOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import { __ } from '@wordpress/i18n';
import Settings from './Settings/index';
import SendSMS from './SendSMS/index';
import SendByWebService from './SendSMSWebService/index';
import Styles from '../css';

const { TabPane } = Tabs;

const Tools = () => {
	return (
		<Col span={24} style={{backgroundColor: '#fff', border: '1px solid #c7c7c7', marginBottom:'20px'}} id="login">
			<h1 style={Styles.SectionTitle}>{ __( 'Tools', 'mp-sms' ) }</h1>
			<Tabs defaultActiveKey="mp-sms-settings" style={Styles.SectionContent}>
				<TabPane tab={ <span> <SettingOutlined />{ __( 'Login', 'mp-sms' ) }</span> } key="mp-sms-settings" >
					<Settings />
				</TabPane>
				<TabPane tab={ <span> <MailOutlined />{ __( 'Send SMS', 'mp-sms' ) }</span> } key="mp-sms-send" >
					<SendSMS />
				</TabPane>
				<TabPane tab={ <span> <MailOutlined />{ __( 'Send SMS ( Web Service )', 'mp-sms' ) } <span className="mp-sms-p-l"> { __( 'Pro ', 'mp-sms' ) }</span></span> } key="mp-sms-send-webservice" >
					<SendByWebService />
				</TabPane>
			</Tabs>
		</Col>
	)
}

export default Tools