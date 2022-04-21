import React, { useState } from 'react';
import axios from 'axios';
import {Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined  } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import Styles from '../../css';

const Send = () => {

	const { TextArea } = Input;

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
			<Col span={8} >
				<Form
				layout="vertical"
				name="basic"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				>

					<Form.Item label={ __( 'Phone Number', mp_sms_localize.text_domain ) } name="username" rules={[{ required: true, message: __( 'Please input mobile phone number', mp_sms_localize.text_domain ) }]} >
						<Input size="large"  placeholder={ __( '0912xxxx or 0912xxx,0935xxx,0919xxx', mp_sms_localize.text_domain ) } showCount maxLength={199} />
						<small className="mp-f-d">{ __( 'You can only send 100 SMS per time', mp_sms_localize.text_domain ) }</small>
					</Form.Item>

					<Form.Item label={ __( 'SMS Content', mp_sms_localize.text_domain ) } name="sms_content" rules={[{ required: true, message: __( 'Please input your password!', mp_sms_localize.text_domain )  }]} >
						<TextArea showCount rows={4} />
					</Form.Item>
					

					<Form.Item>
						<Button
						type="primary"
						htmlType="submit"
						loading={options.loading}
						>
							{  mp_sms_localize.verified == 'false' ? __( 'Submit', mp_sms_localize.text_domain ) : __( 'Update', mp_sms_localize.text_domain ) }
						</Button>
					</Form.Item>

				</Form>
			</Col>
			<Col span={16} >

			</Col>
		</Row>
	)
}

export default Send