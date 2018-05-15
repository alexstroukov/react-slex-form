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
  componentWillReceiveProps (nextProps) {
    if (this.props.submitting && !nextProps.submitting && !nextProps.submitError) {
      this.toggleEdit(false)
    }
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
  render () {
    return <WrappedComponent
      {...this.props}
      toggleEdit={this.toggleEdit}
      submitForm={this.props.submitForm}
    />
  }
})

export default editableShared

