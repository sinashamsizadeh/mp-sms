import React, { useState } from 'react';
import axios from 'axios';
import {Form, Input, Button, message, Row, Col, Tabs } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined, SettingOutlined, MailOutlined  } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import Styles from '../../css';

const SendSMS = () => {

	const { TabPane } = Tabs;

	const [options, setOptions] = useState({
		loading : false
	});

	const onFinish = (values) => {

		setOptions({
			loading: true
		});
		

		axios.post(`${mp_sms_localize.api_url}auth/`, values, {
			headers:{
				'Content-Type':'application/json',
			},
		}).then( res => {
			
			if ( res.data.code == 200 ) {
				message.success( res.data.message );
			} else {
				message.error( res.data.message );
			}

			setOptions({
				loading: false
			});

			setTimeout(() => {
				window.location.replace(mp_sms_localize.admin_url);
			}, 1500 );

		}).catch(err => {
			message.warning( err );

			setOptions({
				loading: false
			});
		});

	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Row>
			<Col span={24} >
				<h1 style={Styles.InnerSectionTitle}>{ __( 'Send SMS', mp_sms_localize.text_domain ) }</h1>
				<div className="send-sms" style={Styles.InnerSectionContent}>
					tab1
				</div>
			</Col>
			<Col span={24} >
				<h1 style={Styles.InnerSectionTitle}>{ __( 'Send Bulk SMS', mp_sms_localize.text_domain ) }</h1>
				<div className="send-sms" style={Styles.InnerSectionContent}>
					tab1
				</div>
			</Col>
		</Row>
	)
}

export default SendSMS