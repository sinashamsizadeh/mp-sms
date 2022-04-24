import React from 'react';
import { __ } from '@wordpress/i18n';
import { Row, Col } from 'antd';
import Styles from '../../css';
import Send from './Send';

const SendSMS = () => {

	return (
		<Row>
			<Col span={24} >
				<h1 style={Styles.InnerSectionTitle}>{ __( 'Send SMS', mp_sms_localize.text_domain ) }</h1>
				<div className="send-sms" style={Styles.InnerSectionContent}>
					<Send />
				</div>
			</Col>
		</Row>
	)
}

export default SendSMS