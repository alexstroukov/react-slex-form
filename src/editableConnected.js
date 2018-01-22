import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import editSubscribers from './editSubscribers'
import editable from './editable'

const editableConnected = subject => WrappedComponent => editable(class EditableConnectedWrapper extends Component {
  toggleEdit = (editing) => {
    editSubscribers.notifySubscribers(subject, (cancelEdit) => {
      cancelEdit()
    })
    this.props.toggleEdit(editing)
  }
  render () {
    return <WrappedComponent {...this.props} toggleEdit={this.toggleEdit}/>
  }
})

export default editableConnected

