import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined, MailOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import { __ } from '@wordpress/i18n';
import Settings from './Settings/index';
import Styles from '../css';

const { TabPane } = Tabs;

const Tools = () => {
	return (
		<Col span={24} style={{backgroundColor: '#fff', border: '1px solid #c7c7c7', marginBottom:'20px'}}>
			<h1 style={Styles.SectionTitle}>{ __( 'Tools', mp_sms_localize.text_domain ) }</h1>
			<Tabs defaultActiveKey="mp-sms-settings" style={Styles.SectionContent}>
				<TabPane tab={ <span> <SettingOutlined />{ __( 'Settings', mp_sms_localize.text_domain ) }</span> } key="mp-sms-settings" >
					<Settings />
				</TabPane>
				<TabPane tab={ <span> <MailOutlined />{ __( 'Send SMS', mp_sms_localize.text_domain ) }</span> } key="mp-sms-send" >
					<Settings />
				</TabPane>
				<TabPane tab={ <span> <MailOutlined />{ __( 'Send SMS ( Web Service )', mp_sms_localize.text_domain ) }</span> } key="mp-sms-send-webservice" >
					<Settings />
				</TabPane>
			</Tabs>
		</Col>
	)
}

export default Tools