import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, View, Button, SafeAreaView } from 'react-native'
import { Header } from 'react-native-elements'

import _ from 'lodash'
import api from '../helper/api'
import authenticate from '../helper/authenticate'
import { Loading } from '../components/Loading'
import { BACKEND_DOMAIN, BACKEND_PREFIX } from '../helper/const/index'


const prefix = BACKEND_DOMAIN + BACKEND_PREFIX

export default function Profile(props: { navigation: any }) {
    const { navigation } = props
    const loadRef = useRef({})
    const [state, setState] = useState({
        name: ''
    })
    useEffect(() => {
        !authenticate.isAuth() ? navigation.replace('Root') :
        loadRef.current.showToast()
        api(`${prefix}users/profile`, 'get').then((res: { data: { data: React.SetStateAction<{}> } }) => {
            loadRef.current.hideToast()
            setState(_.get(res, 'data.data'))
        })
    }, [])
    const onLogout = useCallback(() => {
        loadRef.current.showToast()
        api(`${prefix}sign_out`, 'delete').then((res: { status: string }) => {
            loadRef.current.hideToast()
            authenticate.del()
            navigation.navigate('Root')
        })
    }, [])

    const renderComponent = useCallback(() => {
        return <Button title="Log out" onPress={() => onLogout()} />
    }, [])

    return (
        <View>
            <SafeAreaView style={styles.container}>
                <Header
                    leftComponent={{  text: `Hello: ${_.get(state, 'name')}`, style: { color: '#fff', marginTop: '10px' } }}
                    centerComponent={{ text: `UID: ${_.get(state, 'uid')}`, style: { color: '#fff', marginTop: '10px'  } }}
                    rightComponent={renderComponent()}
                />
            </SafeAreaView>
            <Loading ref={loadRef} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
});
