import React, { Component } from 'react'
import axios from 'axios'
import { Icon, Popconfirm, Table, Button, Input } from 'antd'
import moment from 'moment'
import AddOrEditModal from './AddOrEditModal'

class Index extends Component {
  state = {
    accounts: [],
    error: '',
    loading: false,
    visibleModal: false,
    selectedItem: null,
    loggined: false,
    login: {
      username: '',
      password: ''

    }
  }

  componentDidMount () {
    axios.get('/checkLogin').then(({ data }) => {
      if (data.success) {
        this.setState({
          loggined: true
        })
      }
    })
    this.loadAccounts()
  }

  loadAccounts = async () => {
    this.setState({
      loading: true
    })
    try {
      const { data } = await axios.get(`/accounts`)
      this.setState({
        loading: false,
        accounts: data
      })
    } catch (e) {
      this.setState({
        loading: false,
        error: e.message
      })
    }
  }

  login = async (login, password) => {
    const { data } = await axios.post('/login', {
      login,
      password
    })
    if (data.success) {
      this.setState({
        loggined: true
      })
    }
  }

  openModal = () => {
    this.setState({
      visibleModal: true
    })
  }

  closeModal = () => {
    this.setState({
      visibleModal: false,
      selectedItem: null
    })
  }

  onEdit = (record) => {
    this.setState({
      selectedItem: record,
      visibleModal: true
    })
  }

  onDelete = async (id) => {
    this.setState({
      loading: true
    })
    console.log(id)
    await axios.delete(`/delete`, {
      data: {
        id
      }
    })
    this.setState({
      loading: false
    })
    this.loadAccounts()
  }

  handleSave = async (data) => {
    this.closeModal()
    this.setState({
      loading: true
    })
    const isNew = this.state.selectedItem === null
    if (isNew) {
      await axios.post(`/addAccount`, data)
    } else {
      await axios.patch(`/update`, {
        newData: data,
        id: this.state.selectedItem._id
      })
    }
    this.setState({
      loading: false,
      selectedItem: null
    })
    this.loadAccounts()
  }

  onChange = (e) => {
    this.setState({
      login: {
        ...this.state.login,
        [e.target.name]: e.target.value
      }
    })
  }

  render () {
    const { loading, error, accounts, visibleModal, loggined, login } = this.state

    if (!loggined) {
      return (
        <form>
          <Input
            placeholder='Name'
            name='username'
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={login.username}
            onChange={this.onChange}
            style={{ marginBottom: 10 }}
          />
          <Input
            placeholder='Password'
            name='password'
            type='password'
            prefix={<Icon type='edit' style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={login.password}
            onChange={this.onChange}
            style={{ marginBottom: 10 }}
          />
          <Button type='primary' size='large' onClick={() => this.login(this.state.login.username, this.state.login.password)}>Войти</Button>
        </form>
      )
    }

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: 'License key',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
      render: (text) =>
        <div>{text.substring(0, text.length - 4).replace(/[A-Z,0-9]/g, '*')}{text.substring(text.length - 4)}</div>
    }, {
      title: 'Adding date',
      dataIndex: 'date',
      key: 'date',
      render: (text) =>
        <div>{moment(text).format('DD.MM.YYYY HH:mm')}</div>
    }, {
      title: 'Operations',
      width: 200,
      render: (record) => <div>
        <a onClick={() => this.onEdit(record)}>Edit <Icon type='edit' /></a>
        <Popconfirm title='Sure to delete?' onConfirm={() => this.onDelete(record._id)}>
          <a style={{ float: 'right' }}>Delete <Icon type='delete' /></a>
        </Popconfirm>
      </div>
    }]

    return <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Table dataSource={accounts} columns={columns} loading={loading} rowKey='_id' />
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Button onClick={this.openModal} loading={loading} size='large' type='primary'>Add account</Button>
      </div>
      <AddOrEditModal
        visibleModal={visibleModal}
        handleSave={this.handleSave}
        closeModal={this.closeModal}
        account={this.state.selectedItem}
      />
    </div>
  }
}

export default Index
