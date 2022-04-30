import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd';

ReactDOM.render(
	<ConfigProvider direction={mp_sms_localize.direction}>
		<App />
	</ConfigProvider>,
	document.getElementById('mp-sms-wrap')
);