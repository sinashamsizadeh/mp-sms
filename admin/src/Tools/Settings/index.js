import React, { useState } from 'react';
import axios from 'axios';
import {Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined  } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';

const Settings = () => {

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
			<Col span={8}>
				<Form
				layout="vertical"
				name="basic"
				initialValues={{
					username: mp_sms_localize.options.username,
					password: mp_sms_localize.options.password
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				>

					<Form.Item label={ __( 'Username', 'mp-sms' ) } name="username" rules={[{ required: true, message: __( 'Please input your username!', 'mp-sms' ) }]} >
						<Input size="large"  addonBefore={<UserOutlined />} />
					</Form.Item>

					<Form.Item label={ __( 'Password', 'mp-sms' ) } name="password" rules={[{ required: true, message: __( 'Please input your password!', 'mp-sms' )  }]} >
						<Input.Password size="medium"  addonBefore={<LockOutlined />} />
					</Form.Item>

					<Form.Item>
						<Button
						type="primary"
						htmlType="submit"
						loading={options.loading}
						>
							{  mp_sms_localize.verified == 'false' ? __( 'Submit', 'mp-sms' ) : __( 'Update', 'mp-sms' ) }
						</Button>
					</Form.Item>

				</Form>
			</Col>
			<Col span={16}>
			</Col>
		</Row>
	)
}

export default Settings