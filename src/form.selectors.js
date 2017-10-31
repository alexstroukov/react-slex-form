import _ from 'lodash'
import * as statuses from './form.statuses'
import initialState from './initialState'

class FormSelectors {
  getCanSubmit = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          status
        } = {}
      }
    } = state
    const canSubmit = status === statuses.VALID
    return canSubmit
  }
  getSubmitting = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          status
        } = {}
      }
    } = state
    const submitting = status === statuses.SUBMITTING
    return submitting
  }
  getSubmitError = (state, { formName }) => {
    const {
      form: {
        [formName]: {
          error
        } = {}
      }
    } = state
    return error
  }
}

export default new FormSelectors()
