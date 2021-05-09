import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import 'react-toastify/dist/ReactToastify.css'
import { cssTransition } from 'react-toastify'
import PropTypes from 'prop-types'

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";


const rootLoading = document.getElementById('root')

class PortalModal extends React.Component {
  constructor (props) {
    super(props)
    this.element = document.createElement('div')
  }

  componentDidMount () {
    rootLoading.appendChild(this.element)
  }

  componentWillUnmount () {
    rootLoading.removeChild(this.element)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.element
    )
  }
}

PortalModal.propTypes = {
  children: PropTypes.node
}

const Zoom = cssTransition({
  enter: 'zoomIn',
  exit: 'zoomOut',
  duration: [500, 1500]
})

class Loading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
    this.showToast = this.showToast.bind(this)
    this.hideToast = this.hideToast.bind(this)

    this.counter = []
    this.timerId = []

    this.loadingNumber = 0
    this.timer = null
  }

  showToast () {
    this.loadingNumber++

    const loading = document.getElementsByClassName('global-loading')
    if (loading.length === 0) {
      this.setState({ show: true })
    }

    // Set setInterval
    if (!this.timer) {
      this.timer = setInterval(() => {
        if (this.loadingNumber <= 0) {
          this.setState({ show: false })
          clearInterval(this.timer)
          this.timer = null
          this.loadingNumber = 0
        }
      }
      , 600)
    }
  }

  hideToast () {
    this.loadingNumber--
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    const { show } = this.state
    return (
      <Fragment>
        {
          show &&
          <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" />
        </View>
        }
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    }
  });

export {
  Loading,
}
