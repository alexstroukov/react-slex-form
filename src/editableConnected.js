import PropTypes from 'prop-types'
import React, { Component } from 'react'
import _ from 'lodash'
import editSubscribers from './editSubscribers'
import editable from './editable'
import editableConnectedSubscribers from './editableConnectedSubscribers'

const editableConnected = ({ formName, alias = 'editing' }) => WrappedComponent => editable(class EditableConnectedWrapper extends Component {
  state = { editing: false }
  componentWillMount () {
    this._setEditing = ({ editing }) => this.setState({ editing })
    this.unsubscribe = editableConnectedSubscribers.subscribe(formName, this.setEditing)
  }
  componentWillUnmount () {
    this._setEditing = undefined
    this.unsubscribe && this.unsubscribe()
  }
  setEditing = (editing) => {
    this._setEditing && this._setEditing({ editing })
  }
  toggleEdit = (editing) => {
    editSubscribers.notifySubscribers(formName, (cancelEdit) => {
      cancelEdit()
    })
    this.props.toggleEdit(editing)
  }
  _generateProps = () => {
    return {
      ...this.props,
      toggleEdit: this.toggleEdit,
      [alias]: this.state.editing
    }
  }
  render () {
    return <WrappedComponent {...this._generateProps()} />
  }
})

export default editableConnected

