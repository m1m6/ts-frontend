import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import { apolloClient } from './apollo/apolloClient';
import './assets/styles/_main.scss';

import App from './App';
import { browserHistory } from './browserHistory';
// todod https://reacttraining.com/react-router/web/guides/code-splitting

ReactDOM.render(
	<ApolloProvider client={apolloClient}>
		<ApolloHooksProvider client={apolloClient}>
			<Router history={browserHistory}>
				<App />
			</Router>
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById('root')
);
