import React from 'react';
import { __ } from '@wordpress/i18n';
import { Row, Col } from 'antd';
import Styles from '../../css';
import SendByWebService from './Send';

const SendSMSByWebServices = () => {

	return (
		<Row>
			<Col span={24} >
				<h1 style={Styles.InnerSectionTitle}>{ __( 'Send SMS Using Web Services', mp_sms_localize.text_domain ) }</h1>
				<div className="send-sms" style={Styles.InnerSectionContent}>
					<SendByWebService />
				</div>
			</Col>
		</Row>
	)
}

export default SendSMSByWebServices