import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Divider, Skeleton } from 'antd';
import { MailOutlined, CheckSquareOutlined, CloseSquareOutlined, DollarOutlined } from '@ant-design/icons';
import { __ } from '@wordpress/i18n';
import Styles from '../css';

const Credits = () => {

	const [credits, setCredits] = useState({
		value: 0,
		loading: true,
		mci: 0,
		mtn: 0
	});

	useEffect(() => {
		axios.post(`${mp_sms_localize.api_url}credits/`, {
			headers:{
				'Content-Type':'application/json',
			},
		}).then( res => {

			setCredits({
				value: res.data.message.credits,
				loading: false,
				mci: res.data.message.mtncredits,
				mtn: res.data.message.mcicredits
			});

		}).catch(err => {
			
			console.log(err);

			setCredits({
				value: 0,
				loading: false,
				mci: 0,
				mtn: 0
			});
		});
	},[credits.value]);

	return (
		<Col span={24} style={Styles.SectionWrapper}>
			<h1 style={Styles.SectionTitle}>{ __( 'Service Info', 'mp-sms' ) }</h1>
			<div className="service-info" style={Styles.SectionContent}>
				<Row>
					<Col span={12}>
						{
							credits.value != 0 ?
							<Skeleton loading={credits.loading} active avatar> <CheckSquareOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Success : Styles.RTLCredits.Success} />
								<span>{ __( 'Authorized', 'mp-sms' ) } </span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Error : Styles.RTLCredits.Error} />
								<span>{ __( 'Not authorized.', 'mp-sms' ) }</span> <a href="#login" >{ __( 'Please login.', 'mp-sms' ) }</a>
							</Skeleton>
						}
						<Divider />
						{
							credits.value != 0 ?
							<Skeleton loading={credits.loading} active avatar> <MailOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Success : Styles.RTLCredits.Success} />
								<span>{ __( 'You can send ~', 'mp-sms' ) } { `${credits.value}` } { __( 'Messages', 'mp-sms' ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <MailOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Error : Styles.RTLCredits.Error} />
								<span>{ __( 'You can send ~', 'mp-sms' ) } { `${credits.value}` } { __( 'Messages', 'mp-sms' ) }</span>
							</Skeleton>
						}
						<Divider />
					</Col>
					<Col span={12}>
						{
							credits.mci != 0 ?
							<Skeleton loading={credits.loading} active avatar> <DollarOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Success : Styles.RTLCredits.Success} />
								<span>{ __( 'The price to send SMS for Irancell equal is', 'mp-sms' ) } { `${credits.mci}` } { __( 'T', 'mp-sms' ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Error : Styles.RTLCredits.Error} />
								<span>{ __( 'We are sorry, but we can\'t estimate the price. please login using the following form', 'mp-sms' ) }</span>
							</Skeleton>
						}

						<Divider />
						{
							credits.mtn != 0 ?
							<Skeleton loading={credits.loading} active avatar> <DollarOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Success : Styles.RTLCredits.Success} />
								<span>{ __( 'The price to send SMS for Hamrah Aval equal is', 'mp-sms' ) } { `${credits.mtn}` } { __( 'T', 'mp-sms' ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={mp_sms_localize.direction == 'ltr' ? Styles.Credits.Error : Styles.RTLCredits.Error} />
								<span>{ __( 'We are sorry, but we can\'t estimate the price. please login using the following form', 'mp-sms' ) }</span>
							</Skeleton>
						}

						<Divider />

					</Col>
				</Row>
			</div>
		</Col>
	)
}

export default Credits