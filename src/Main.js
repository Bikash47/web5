import React, {Component} from 'react';
import reducers from './reducers';
import {View} from 'react-native';
import Router from './Router';
import ReduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

class Main extends Component {
    render() {
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
        return (
            <View style={{flex: 1}}>


                <Provider store={store}>
                    <Router/>
                    {/*<View>
                    <Header headerText="Login"/>
                    <LoginPage />
                </View>*/}
                </Provider>
            </View>
        );
    }
}

export default Main;