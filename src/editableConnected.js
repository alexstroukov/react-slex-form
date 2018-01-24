import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import editSubscribers from './editSubscribers'
import editable from './editable'
import editableConnectedSubscribers from './editableConnectedSubscribers'

const editableConnected = subject => WrappedComponent => editable(class EditableConnectedWrapper extends Component {
  state = { subjectEditing: false }
  componentWillMount () {
    this._setEditing = ({ subjectEditing }) => this.setState({ subjectEditing })
    this.unsubscribe = editableConnectedSubscribers.subscribe(subject, this.setEditing)
  }
  componentWillUnmount () {
    this._setEditing = undefined
    this.unsubscribe && this.unsubscribe()
  }
  setEditing = (subjectEditing) => {
    this._setEditing && this._setEditing({ subjectEditing })
  }
  toggleEdit = (subjectEditing) => {
    editSubscribers.notifySubscribers(subject, (cancelEdit) => {
      cancelEdit()
    })
    this.props.toggleEdit(subjectEditing)
  }
  _generateProps = () => {
    return {
      ...this.props,
      toggleEdit: this.toggleEdit,
      [subject + 'Editing']: this.state.subjectEditing
    }
  }
  render () {
    return <WrappedComponent {...this._generateProps()} />
  }
})

export default editableConnected

