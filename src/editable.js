import PropTypes from 'prop-types'
import React, { Component } from 'react'
import editableConnectedSubscribers from './editableConnectedSubscribers'
import isEvent from './isEvent'

const editable = WrappedComponent => class EditableWrapper extends Component {
  state = {
    editing: !!this.props.editing,
    submitting: !!this.props.submitting
  }
  componentWillReceiveProps (nextProps) {
    if (this.state.submitting !== !!nextProps.submitting) {
      if (this.state.submitting) {
        if (nextProps.submitError) {
          this.toggleSubmit(nextProps.submitting)
        } else {
          this.cancelEdit(nextProps.submitting)
        }
      } else {
        this.toggleSubmit(nextProps.submitting)
      }
    }
  }
  componentDidMount () {
    this._cancelEdit = submitting => {
      this.setState({ editing: false, submitting })
    }
    this._toggleEdit = editing => {
      this.setState({ editing })
    }
    this._toggleSubmit = submitting => {
      this.setState({ submitting })
    }
  }
  componentWillUnmount () {
    this._cancelEdit = undefined
    this._toggleEdit = undefined
    this._toggleSubmit = undefined
    editableConnectedSubscribers.notifySubscribers(this.props.formName, (setEditing) => {
      setEditing(false)
    })
  }
  cancelEdit = (submitting = false) => {
    this._cancelEdit && this._cancelEdit(isEvent(submitting) ? !this.state.submitting : submitting)
  }
  toggleEdit = (editing) => {
    editing = isEvent(editing) || editing === undefined ? !this.state.editing : editing
    if (this.state.editing && !editing) {
      this.props.resetForm()
    }
    this._toggleEdit && this._toggleEdit(editing)
    editableConnectedSubscribers.notifySubscribers(this.props.formName, (setEditing) => {
      setEditing(editing)
    })
  }
  toggleSubmit = (submitting = !this.state.submitting) => {
    this._toggleSubmit && this._toggleSubmit(isEvent(submitting) ? !this.state.submitting : submitting)
  }
  render () {
    const { editing } = this.state
    return <WrappedComponent {...this.props} editing={editing} toggleEdit={this.toggleEdit} />
  }
}

editable.propTypes = {
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default editable

