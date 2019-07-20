import React, { Component, Fragment } from 'react'
import moment from 'moment'
import TransactionsTable from '../components/TransactionsTable'
import MonthPicker from '../components/MonthPicker'
import ChartsCard from '../components/ChartsCard'
import Statistics from '../components/Statistics'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      month: moment().subtract(1, 'month'),
      resetPage: false
    }
    this.handleMonthPickerChange = this.handleMonthPickerChange.bind(this)
    this.forceUpdateAfterEdit = this.forceUpdateAfterEdit.bind(this)
    this.falseResetPage = this.falseResetPage.bind(this)
  }

  falseResetPage() {
    this.setState({ resetPage: false })
  }

  forceUpdateAfterEdit() {
    const month = this.state.month.date() === 1 ? this.state.month.add(2, 'day') : this.state.month.subtract(1, 'day')
    this.setState({ month: month })
  }

  handleMonthPickerChange = (month) => {
    this.setState({ 
      month: month, 
      resetPage: true 
    })
  }

  groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key]
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
      return objectsByKeyValue
    }, {})

  render() {
    const transactions = window.ipcRenderer.sendSync('get-transactions', this.state.month.format('YYYY-MM-DD'))
    const groupByCategoryName = this.groupBy('categoryName')
    const groupedTransactions = groupByCategoryName(transactions)
    const incomeTransactions = groupedTransactions.Income
    delete groupedTransactions.Income

    return (
      <Fragment>
        <div uk-grid="true">
          <div className="uk-width-1">
            <div className="uk-card uk-card-default">
              <MonthPicker 
                month={this.state.month} 
                onChange={this.handleMonthPickerChange} />
            </div>
          </div>
        </div>

        <div className="uk-grid-match" uk-grid="true">
          <div className="uk-width-1-2">
            <div className="uk-card uk-card-default uk-card-body">
              <Statistics 
                transactions={transactions}
                income={incomeTransactions}
                savings={groupedTransactions.Savings} />
            </div>
          </div>
          <div className="uk-width-1-2">
            <div className="uk-card uk-card-default uk-card-body">
              <ChartsCard 
                data={groupedTransactions} />
            </div>
          </div>
        </div>

        <div uk-grid="true">
          <div className="uk-width-1">
            <div className="uk-card uk-card-default">
              <TransactionsTable 
                data={transactions}
                forceUpdate={this.forceUpdateAfterEdit}
                resetPage={this.state.resetPage}
                falseResetPage={this.falseResetPage} />
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default HomePage
