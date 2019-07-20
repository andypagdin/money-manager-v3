import React, { Component } from 'react'

class Statistics extends Component {
  constructor(props) {
    super(props)
    this.formatIncome = this.formatIncome.bind(this)
    this.formatOutgoing = this.formatOutgoing.bind(this)
    this.formatSavings = this.formatSavings.bind(this)
  }

  formatIncome(income) {
    let totalIncome = 0
    if (!income) return totalIncome.toFixed(2)
    for (let i = 0; i < income.length; i++) {
      totalIncome += income[i].Value
    }
    return totalIncome
  }

  formatOutgoing(transactions) {
    let totalOutgoing = 0
    if (transactions.length === 0) return totalOutgoing
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].Value < 0 && transactions[i].categoryName !== 'Savings') {
        totalOutgoing += transactions[i].Value
      }
    }
    return totalOutgoing
  }

  formatSavings(transactions) {
    let totalSavings = 0
    if (!transactions) return totalSavings
    for (let i = 0; i < transactions.length; i++) {
      totalSavings += transactions[i].Value
    }
    return totalSavings
  }

  render() {
    const income = Math.abs(this.formatIncome(this.props.income)).toFixed(2)
    const outgoing = Math.abs(this.formatOutgoing(this.props.transactions)).toFixed(2)
    const savings = Math.abs(this.formatSavings(this.props.savings)).toFixed(2)
    const net = income - outgoing

    let netClass
    if (net > 0) {
      netClass = 'positive'
    } else if (net < 0) {
      netClass = 'negative'
    } else {
      netClass = ''
    }

    return (
      <ul className="uk-list">
        <li>Income £{income}</li>
        <li>Outgoing £{outgoing}</li>
        <li>Savings £{savings}</li>
        <li>Net <span className={netClass}>{net.toFixed(2)}</span></li>
      </ul>
    )
  }
}

export default Statistics