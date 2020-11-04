import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient } from 'apollo-client';

import { ACCESS_TOKEN } from '../constants';
import defaultState from './defaultState';
import resolvers from './resolvers';

const httpLink = createHttpLink({ uri: 'http://localhost:4000' });
const cache = new InMemoryCache({ freezeResults: true });
cache.writeData({ data: defaultState });

const middlewareLink = new ApolloLink((operation, forward) => {
    const tokenValue = localStorage.getItem(ACCESS_TOKEN);
    operation.setContext({
        headers: {
            Authorization: tokenValue ? `Bearer ${tokenValue}` : '',
        },
    });
    return forward(operation);
});

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WS_GRAPHQL_URL ,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    },
});
const uploadLink = createUploadLink({ uri: process.env.REACT_APP_HTTP_GRAPHQL_URL });

const httpLinkAuth = middlewareLink.concat(uploadLink);

const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLinkAuth,
    defaultState
);

// apollo client setup
export const apolloClient = new ApolloClient({
    link: ApolloLink.from([link]),
    cache,
    connectToDevTools: true,
    resolvers,
    assumeImmutableResults: true,
});
