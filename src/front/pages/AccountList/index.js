import React, { Component } from 'react'
import axios from 'axios'
import { Icon, Popconfirm, Table, Button } from 'antd'
import moment from 'moment'
import { HOST } from '../../global'
import AddOrEditModal from './AddOrEditModal'

class Index extends Component {
  state = {
    accounts: [],
    error: '',
    loading: false,
    visibleModal: false,
    selectedItem: null
  }

  componentDidMount () {
    this.loadAccounts()
  }

  loadAccounts = async () => {
    this.setState({
      loading: true
    })
    try {
      const { data } = await axios.get(`${HOST}/accounts`, {
        withCredentials: true
      })
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
    await axios.delete(`${HOST}/delete`, {
      data: {
        id
      },
      withCredentials: true
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
      await axios.post(`${HOST}/addAccount`, data, {
        withCredentials: true
      })
    } else {
      await axios.patch(`${HOST}/update`, {
        newData: data,
        id: this.state.selectedItem._id
      }, {
        withCredentials: true
      })
    }
    this.setState({
      loading: false,
      selectedItem: null
    })
    this.loadAccounts()
  }

  render () {
    const { loading, error, accounts, visibleModal } = this.state

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
