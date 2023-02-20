import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';
import { ApolloProvider, ApolloConsumer } from 'react-apollo';

const client = new ApolloClient({ uri: 'http://localhost:4000/' });
client.query({ query: gql`
    {
        recipes {
            id
            title
        }
    }
`}).then(result => console.dir(result));

function App() {
    const [state, set] = useState('Nothing to comment...');

    useEffect(() => {
        setTimeout(() => {
            set('2 seconds have passed...');
        }, 2000);
    }, []);

    return (
        <ApolloProvider client={client}>
            <div>Hello World! - {state}</div>

            <ApolloConsumer>
                {client => {
                    client.query({ query: gql`
                        {
                            recipes {
                                id
                                title
                            }
                        }
                    `}).then(result => console.dir(result));

                    return null;
                }}
            </ApolloConsumer>
        </ApolloProvider>
    );
}

export default App;
