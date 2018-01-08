class Subscription {
  subscribers = {}
  subscribe = (subject, callback) => {
    const subjectSubscribers = this.subscribers[subject] || []
    const nextSubjectSubscribers = [...subjectSubscribers, callback]
    this.subscribers = {
      ...this.subscribers,
      [subject]: nextSubjectSubscribers
    }
    return () => {
      this.unsubscribe(subject, callback)
    }
  }
  unsubscribe = (subject, callback) => {
    const subjectSubscribers = this.subscribers[subject] || []
    const index = subjectSubscribers.indexOf(callback)
    if (index !== -1) {
      const nextSubjectSubscribers = [ ...subjectSubscribers.slice(0, index), ...subjectSubscribers.slice(index + 1)]
      if (nextSubjectSubscribers.length === 0) {
        const { [subject]: subjectSubscribers, ...rest } = this.subscribers
        this.subscribers = {
          ...rest
        }
      } else {
        this.subscribers = {
          ...this.subscribers,
          [subject]: nextSubjectSubscribers
        }
      }
    }
  }
  notifySubscribers = (subject, notifySubscriber) => {
    const subjectSubscriptions = this.subscribers[subject] || []
    for (const callback of subjectSubscriptions) {
      notifySubscriber(callback)
    }
  }
}

export default Subscription
