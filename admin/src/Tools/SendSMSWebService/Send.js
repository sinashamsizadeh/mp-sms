import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Form, Input, Button, message, Row, Col, Select, Tooltip, Modal, notification } from 'antd';
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Parser from 'html-react-parser';
import { __ } from '@wordpress/i18n';
import Styles from '../../css';

const SendByWebService = () => {

	const { TextArea }	= Input;
	const { Option }	= Select;
	let numbers = [];
	const result = [];
	const patterns = [];

	for ( let k = 0; k < mp_sms_localize.options.patterns.length; k++ ) {

		if ( mp_sms_localize.options.patterns[k].BodyStatus == 1 ) {

			patterns.push(<Option key={mp_sms_localize.options.patterns[k].Body} title={mp_sms_localize.options.patterns[k].Body}>{mp_sms_localize.options.patterns[k].Title}</Option>);
		}
	}

	const [options, setOptions] = useState({
		loading : false,
		numtype : 'custom_users_webservice',
		send : false,
		result: null
	});

	const onFinish = (values) => {

		setOptions({
			loading: true,
			numtype : values.numbers_type,
			send : false,
			result: null
		});

		if ( ! mp_sms_localize.expandable.pro && ! mp_sms_localize.expandable.trusted ) {

			notification.error({
				placement: 'bottomRight',
				message: __( 'Access denied', mp_sms_localize.text_domain ),
				description: Parser( __( 'To enable this feature need a pro version <br/><a href="' + mp_sms_localize.purchase + '" target="_blank"><b style="color: #fff; background: #000; padding: 3px 11px; display: inline-block; margin-top: 8px; border-radius: 3px;">Go Pro</b></a>', mp_sms_localize.text_domain ) ),
			});

			setOptions({
				loading: false,
				numtype : values.numbers_type,
				send : false,
				result: null
			});
		}

		axios.post(`${mp_sms_localize.api_url + values.numbers_type}/`, values, {
			headers:{
				'Content-Type':'application/json',
			},
		}).then( res => {
			
			console.log(res);
			console.log(res.data.string);
			console.log(typeof res.data.string);
			console.log(res.data.string.length);

			if ( typeof res.data.string == 'object' ) {
				
				for ( let i = 0; i < res.data.string.length; i++ ) {
					
					if ( res.data.string[i] == '0' ) {

						message =  __( 'Username or password is incorrect.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '1' ) {
		
						message =  __( 'The request was completed successfully.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '2' ) {
		
						message =  __( 'Credit is not enough.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '3' ) {
		
						message =  __( 'Restrictions on daily submissions.', mp_sms_localize.text_domain );
					}  else if ( res.data.string[i] == '4' ) {
		
						message =  __( 'Limitation on posting volume.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '5' ) {
		
						message =  __( 'Sender number is not valid.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '6' ) {
		
						message =  __( 'The system is being updated.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '7' ) {
		
						message =  __( 'The text contains the word filtered.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '9' ) {
		
						message =  __( 'Sending from public lines through web service is not possible.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '10' ) {
		
						message =  __( 'The user is not active.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '11' ) {
						
						message =  __( 'Not sent.', mp_sms_localize.text_domain );
					} else if ( res.data.string[i] == '12' ) {
						
						message =  __( 'User authentication are not complete.', mp_sms_localize.text_domain );
					} else {
						
						message = __( 'SMS successfully sent.', mp_sms_localize.text_domain );
					}
					
					result.push(<p key={res.data.numbers[i]}>{res.data.numbers[i]} : {message}</p>) ;
				}

			}

			setOptions({
				loading : false,
				numtype : options.numtype,
				send : true,
				result: result
			});

		}).catch(err => {

			console.log(err);

			setOptions({
				loading: false
			});
		});
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const handleNumbersType = (type) => {

		setOptions({
			loading : options.loading,
			numtype : type,
		});

	};

	return (
		<Row>
			<Modal
				title={ __( 'Report the status of sending messages.', mp_sms_localize.text_domain ) }
				centered
				visible={options.send}
				width={768}
				bodyStyle={{height:'400px',overflowY:'scroll'}}
				footer={[
					<Button key="ok" onClick={() => setOptions({
						loading : false,
						numtype : 'custom_users_webservice',
						send : false
					})}>
						{ __( 'OK', mp_sms_localize.text_domain ) }
					</Button>,
				]}
			>
				{options.result}
			</Modal>

			<Col span={8} >
				<Form
				layout="vertical"
				name="send_sms"
				initialValues={{
					numbers_type: 'custom_users_webservice',
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				>

					<Form.Item label={ __( 'Select the source of phone numbers', mp_sms_localize.text_domain ) } name="numbers_type">
						<Select size="large" allowClear>
							<Option value="custom_users_webservice">{ __( 'Custom Numbers', mp_sms_localize.text_domain ) }</Option>
							<Option value="woo_users_webservice">{ __( 'Woocommerce Numbers', mp_sms_localize.text_domain ) }</Option>
						</Select>
					</Form.Item>

					<Form.Item
						shouldUpdate={(prevValues, currentValues) => prevValues.numbers_type !== currentValues.numbers_type}
					>
						{({ getFieldValue }) =>
							getFieldValue('numbers_type') === 'custom_users_webservice' ? (
								<Form.Item name="custom_users_webservice" label={<Tooltip overlayInnerStyle={{width:'450px'}} title={ __( 'You can only send 100 SMS per time. ( separate the numbers with "," )', mp_sms_localize.text_domain ) } placement="right" >
									{ __( 'Phone Number', mp_sms_localize.text_domain )  }<QuestionCircleOutlined style={{marginLeft:'8px'}}/> </Tooltip>} rules={[{ required: true, message: __( 'Please input mobile phone number', mp_sms_localize.text_domain ) }]} >
									<TextArea rows={4} placeholder={ __( '0912xxxx or 0912xxx,0935xxx,0919xxx', mp_sms_localize.text_domain ) } showCount maxLength={199} />
								</Form.Item> 
							) : null
						}
					</Form.Item>

					<Form.Item label={ __( 'Select a pattern to send', mp_sms_localize.text_domain ) } name="pattern" rules={[{ required: true, message: __( 'Please select a pattern', mp_sms_localize.text_domain ) }]}>
						<Select size="large" allowClear onChange={handleNumbersType}>
							{patterns}
						</Select>
					</Form.Item>

					<Form.Item>
						<Button
						type="primary"
						htmlType="submit"
						loading={options.loading}
						>
							{  mp_sms_localize.verified == 'false' ? __( 'Submit', mp_sms_localize.text_domain ) : __( 'SEND', mp_sms_localize.text_domain ) }
						</Button>
					</Form.Item>

				</Form>
			</Col>
			<Col span={16} >

			</Col>
		</Row>
	)
}

export default SendByWebService;