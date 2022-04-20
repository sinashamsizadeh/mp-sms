import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined, MailOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { __ } from '@wordpress/i18n';
import Settings from './Settings/index';

const { TabPane } = Tabs;

const App = () => {
	return (
		<Row>
			<Col span={24}>
				<Tabs defaultActiveKey="2">
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
		</Row>
	)
}

export default App