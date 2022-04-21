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
			<h1 style={Styles.SectionTitle}>{ __( 'Service Info', mp_sms_localize.text_domain ) }</h1>
			<div className="service-info" style={Styles.SectionContent}>
				<Row>
					<Col span={12}>
						{
							credits.value != 0 ?
							<Skeleton loading={credits.loading} active avatar> <CheckSquareOutlined style={{color: '#00cd1d', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'Authorized', mp_sms_localize.text_domain ) } </span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={{color: '#cd0000', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'Not authorized.', mp_sms_localize.text_domain ) }</span> <a href="#login" >{ __( 'Please login.', mp_sms_localize.text_domain ) }</a>
							</Skeleton>
						}
						<Divider />
						{
							credits.value != 0 ?
							<Skeleton loading={credits.loading} active avatar> <MailOutlined style={{color: '#00cd1d', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'You can send ~', mp_sms_localize.text_domain ) } { `${credits.value}` } { __( 'Messages', mp_sms_localize.text_domain ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <MailOutlined style={{color: '#cd0000', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'You can send ~', mp_sms_localize.text_domain ) } { `${credits.value}` } { __( 'Messages', mp_sms_localize.text_domain ) }</span>
							</Skeleton>
						}
						<Divider />
					</Col>
					<Col span={12}>
						{
							credits.mci != 0 ?
							<Skeleton loading={credits.loading} active avatar> <DollarOutlined style={{color: '#00cd1d', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'The price to send SMS for Irancell equal is', mp_sms_localize.text_domain ) } { `${credits.mci}` } { __( 'T', mp_sms_localize.text_domain ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={{color: '#cd0000', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'We are sorry, but we can\'t estimate the price. please login using the following form', mp_sms_localize.text_domain ) }</span>
							</Skeleton>
						}

						<Divider />
						{
							credits.mtn != 0 ?
							<Skeleton loading={credits.loading} active avatar> <DollarOutlined style={{color: '#00cd1d', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'The price to send SMS for Hamrah Aval equal is', mp_sms_localize.text_domain ) } { `${credits.mtn}` } { __( 'T', mp_sms_localize.text_domain ) }</span>
							</Skeleton>
							:
							<Skeleton loading={credits.loading} active avatar> <CloseSquareOutlined style={{color: '#cd0000', fontSize: '18px', marginRight: '8px'}} />
								<span>{ __( 'We are sorry, but we can\'t estimate the price. please login using the following form', mp_sms_localize.text_domain ) }</span>
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