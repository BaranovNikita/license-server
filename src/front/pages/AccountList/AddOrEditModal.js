import React, { PureComponent } from 'react'
import axios from 'axios'
import { Icon, Input, Modal } from 'antd'
import PropTypes from 'prop-types'

class AddOrEditModal extends PureComponent {
  static propTypes = {
    account: PropTypes.object,
    visibleModal: PropTypes.bool.isRequired,
    handleSave: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.account && !prevState.name) {
      return {
        ...nextProps.account
      }
    }
    return null
  }

  state = {
    name: '',
    email: '',
    licenseKey: ''
  }

  componentDidMount () {
    if (!this.props.account || !this.props.account.licenseKey) {
      this.generateLicenseKey()
    }
  }

  generateLicenseKey = async () => {
    const { data } = await axios.get(`http://localhost:1080/generateKey`)
    this.setState({
      licenseKey: data.key
    })
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOk = () => {
    this.props.handleSave({
      name: this.state.name.trim(),
      email: this.state.email.trim(),
      licenseKey: this.state.licenseKey.trim()
    })
    this.setState({
      name: '',
      email: '',
      licenseKey: ''
    }, this.generateLicenseKey)
  }

  render () {
    const { name, email, licenseKey } = this.state
    return <Modal
      title='Edit account'
      visible={this.props.visibleModal}
      onOk={this.handleOk}
      onCancel={() => {
        this.props.closeModal()
        this.setState({
          name: '',
          email: '',
          licenseKey: ''
        }, this.generateLicenseKey)
      }}
    >
      <form>
        <Input
          placeholder='Name'
          name='name'
          prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={name}
          onChange={this.onChange}
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder='Email'
          name='email'
          prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={email}
          onChange={this.onChange}
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder='License key'
          name='licenseKey'
          disabled
          prefix={<Icon type='key' style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={licenseKey}
          onChange={this.onChange}
          suffix={<Icon type='reload' onClick={this.generateLicenseKey} style={{ fontSize: 22, cursor: 'pointer' }} />}
        />
      </form>
    </Modal>
  }
}

export default AddOrEditModal
