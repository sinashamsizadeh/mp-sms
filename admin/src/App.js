import React from 'react';
import { Tabs } from 'antd';
import { Row } from 'antd';
import { __ } from '@wordpress/i18n';
import Credits from './ServiceInfo/Credits';
import Tools from './Tools/index';

const { TabPane } = Tabs;

const App = () => {
	return (
		<Row>
			<Credits />
			<Tools />
		</Row>
	)
}

export default App