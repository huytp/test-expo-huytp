import { Header } from 'react-native-elements'
import React, { useCallback, useEffect, useRef } from 'react'
import { Button, StyleSheet, SafeAreaView, View } from 'react-native'

import initFB from '../helper/initFB'
import api from '../helper/api/index.tsx'
import authenticate from '../helper/authenticate'
import { Loading } from '../components/Loading'
import { BACKEND_DOMAIN, BACKEND_PREFIX } from '../helper/const/index'

const prefix = BACKEND_DOMAIN + BACKEND_PREFIX

export default function LoginByFacebook(props: { navigation: any; }) {
    const { navigation } = props
    const loadRef = useRef({})
    useEffect(() => { initFB()}, [])

    const onSubmitFB = useCallback(() => {
        loadRef.current.showToast()
        FB.login(function (response: { authResponse: { accessToken: any; }; }) {
            if (response.authResponse) {
                FB.api('/me', function () {
                    api(`${prefix}sign_in`, 'post', { accessToken: response.authResponse.accessToken }).then(res => {
                        loadRef.current.hideToast()
                        authenticate.set(res.data.data)
                        // localStorage.setItem("keep", JSON.stringify(res.data.data))
                        navigation.navigate('Profile')
                    })
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    }, [])
    
    const renderComponent = useCallback(() => {
        return <Button title="Facebook" onPress={() => onSubmitFB()} />
    }, [])
    
    return (
        <View>
            <SafeAreaView style={styles.container}>
                <Header
                    leftComponent={{ text: 'HOME PAGE' , style: { marginTop: '10px', color: 'white' }}}
                    rightComponent={ !authenticate.isAuth() && renderComponent() }
                />
            </SafeAreaView>
            <Loading ref={loadRef} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
});
