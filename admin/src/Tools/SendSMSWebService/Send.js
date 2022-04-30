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

			patterns.push(<Option key={mp_sms_localize.options.patterns[k].BodyID} title={mp_sms_localize.options.patterns[k].Body} value={mp_sms_localize.options.patterns[k].BodyID}>{mp_sms_localize.options.patterns[k].Title}</Option>);
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
				message: __( 'Access denied', 'mp-sms' ),
				description: Parser( __( 'To enable this feature need a pro version <br/><a href="' + mp_sms_localize.purchase + '" target="_blank"><b style="color: #fff; background: #000; padding: 3px 11px; display: inline-block; margin-top: 8px; border-radius: 3px;">Go Pro</b></a>', 'mp-sms' ) ),
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
					
					if ( res.data.string[i] == '-7' ) {

						message =  __( 'An error has occurred in the sender number. Contact MeliPayamak support.', 'mp-sms' );
					} else if ( res.data.string[i] == '-6' ) {
		
						message =  __( 'Internal error occurred Contact MeliPayamak support.', 'mp-sms' );
					} else if ( res.data.string[i] == '-5' ) {
		
						message =  __( 'The submitted text does not match the specified params in the default text.', 'mp-sms' );
					} else if ( res.data.string[i] == '-4' ) {
		
						message =  __( 'The submitted text code is incorrect or has not been verified by the system administrator.', 'mp-sms' );
					}  else if ( res.data.string[i] == '-3' ) {
		
						message =  __( 'The line sent is not defined in the system, contact the system MeliPayamak support.', 'mp-sms' );
					} else if ( res.data.string[i] == '-2' ) {
		
						message =  __( 'Number limit is the limit each time you send a mobile number.', 'mp-sms' );
					} else if ( res.data.string[i] == '-1' ) {
		
						message =  __( 'Access to this web service is disabled. Contact MeliPayamak support.', 'mp-sms' );
					} else if ( res.data.string[i] == '-1' ) {
		
						message =  __( 'The text contains the word filtered.', 'mp-sms' );
					} else if ( res.data.string[i] == '0' ) {
		
						message =  __( 'Username or password is incorrect.', 'mp-sms' );
					} else if ( res.data.string[i] == '2' ) {
		
						message =  __( 'Credit is not enough.', 'mp-sms' );
					} else if ( res.data.string[i] == '6' ) {
						
						message =  __( 'The system is being updated.', 'mp-sms' );
					} else if ( res.data.string[i] == '7' ) {
						
						message =  __( 'The text contains the filtered word, Contact MeliPayamak support.', 'mp-sms' );
					} else if ( res.data.string[i] == '10' ) {
						
						message =  __( 'The intended user is not active.', 'mp-sms' );
					} else if ( res.data.string[i] == '11' ) {
						
						message =  __( 'Not Send.', 'mp-sms' );
					} else if ( res.data.string[i] == '12' ) {
						
						message =  __( 'User authentication are not complete.', 'mp-sms' );
					} else {
						
						message = __( 'SMS successfully sent.', 'mp-sms' );
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

			console.log(result);

		}).catch(err => {

			message.error(err);

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
				title={ __( 'Report the status of sending messages.', 'mp-sms' ) }
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
						{ __( 'OK', 'mp-sms' ) }
					</Button>,
				]}
			>
				{options.result}
			</Modal>

			<Col span={11} >
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

					<Form.Item label={ __( 'Select the source of phone numbers', 'mp-sms' ) } name="numbers_type">
						<Select size="large" allowClear>
							<Option value="custom_users_webservice">{ __( 'Custom Numbers', 'mp-sms' ) }</Option>
							<Option value="woo_users_webservice">{ __( 'Woocommerce Numbers', 'mp-sms' ) }</Option>
						</Select>
					</Form.Item>

					<Form.Item
						shouldUpdate={(prevValues, currentValues) => prevValues.numbers_type !== currentValues.numbers_type}
					>
						{({ getFieldValue }) =>
							getFieldValue('numbers_type') === 'custom_users_webservice' ? (
								<Form.Item name="custom_users_webservice" label={<Tooltip overlayInnerStyle={{width:'450px'}} title={ __( 'You can only send 100 SMS per time. ( separate the numbers with "," )', 'mp-sms' ) } placement="right" >
									{ __( 'Phone Number', 'mp-sms' )  }<QuestionCircleOutlined style={{marginLeft:'8px'}}/> </Tooltip>} rules={[{ required: true, message: __( 'Please input mobile phone number', 'mp-sms' ) }]} >
									<TextArea rows={4} placeholder={ __( '0912xxxx or 0912xxx,0935xxx,0919xxx', 'mp-sms' ) } showCount maxLength={199} />
								</Form.Item> 
							) : null
						}
					</Form.Item>

					<Form.Item label={ __( 'Select a pattern to send', 'mp-sms' ) } name="pattern" rules={[{ required: true, message: __( 'Please select a pattern', 'mp-sms' ) }]}>
						<Select size="large" allowClear onChange={handleNumbersType}>
							{patterns}
						</Select>
					</Form.Item>

					<Form.Item name="patern_params" extra={ __( 'Also can use nickname, first_name and last_name for params when selecting WooCommerce Numbers', 'mp-sms' ) } label={<Tooltip overlayInnerStyle={{width:'450px'}} title={ __( 'separate the parms with ",". ( Example: param1,param2,param3 )', 'mp-sms' ) } placement="right" >
						{ __( 'Pattern params', 'mp-sms' )  }<QuestionCircleOutlined style={{marginLeft:'8px'}}/> </Tooltip>} rules={[{ required: true, message: __( 'Please input pattern params', 'mp-sms' ) }]} >
						<TextArea rows={1} placeholder={ __( 'param1 or param1,param2,param3x', 'mp-sms' ) } showCount maxLength={199} />
					</Form.Item> 

					<Form.Item>
						<Button
						type="primary"
						htmlType="submit"
						loading={options.loading}
						>
							{  mp_sms_localize.verified == 'false' ? __( 'Submit', 'mp-sms' ) : __( 'SEND', 'mp-sms' ) }
						</Button>
					</Form.Item>

				</Form>
			</Col>
			<Col span={13} >

			</Col>
		</Row>
	)
}

export default SendByWebService;