import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import editSubscribers from './editSubscribers'
import editable from './editable'

const editableShared = subject => WrappedComponent => editable(class EditableSharedWrapper extends Component {
  componentWillMount () {
    this.unsubscribe = editSubscribers.subscribe(subject, this.cancelEdit)
  }
  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }
  cancelEdit = () => {
    this.props.toggleEdit(false)
  }
  toggleEdit = (editing) => {
    editSubscribers.notifySubscribers(subject, (cancelEdit) => {
      if (cancelEdit !== this.cancelEdit) {
        cancelEdit()
      }
    })
    this.props.toggleEdit(editing)
  }
  submit = (...args) => {
    const { submit } = this.props
    return submit(...args)
      .then((result) => {
        this.toggleEdit(false)
        return result
      })
  }
  render () {
    return <WrappedComponent {...this.props} toggleEdit={this.toggleEdit} submit={this.submit} />
  }
})

export default editableShared

