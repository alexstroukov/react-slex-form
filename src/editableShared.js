import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import editSubscribers from './editSubscribers'
import editable from './editable'

const editableShared = ({ formName }) => WrappedComponent => editable(class EditableSharedWrapper extends Component {
  componentDidMount () {
    this.unsubscribe = editSubscribers.subscribe(formName, this.cancelEdit)
    if (this.props.editing) {
      this.toggleEdit(this.props.editing)
    }
  }
  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }
  cancelEdit = () => {
    this.props.toggleEdit(false)
  }
  toggleEdit = (editing) => {
    editSubscribers.notifySubscribers(formName, (cancelEdit) => {
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

