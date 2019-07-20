import React, { Component } from 'react'
import moment from 'moment'
import '../styles/MonthPicker.css'

class DatePicker extends Component {
  constructor(props) {
    super(props)
    this.month = this.props.month
  }

  decrementMonth = () => {
    this.props.onChange(this.month.subtract(1, 'month'))
  }

  incrementMonth = () => {
    this.props.onChange(this.month.add(1, 'month'))
  }

  render() {
    return (
      <div id="month-picker">
        <span id="decrement-month" onClick={this.decrementMonth}>{'< '}</span>
        <span>{this.month.format('MMM YYYY')}</span>
        <span id="increment-month" onClick={this.incrementMonth}>
          {this.month.clone().add(1, 'hour') > moment() ? '' : ' >'}
        </span>
      </div>
    )
  }
}

export default DatePicker