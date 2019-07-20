import React, { Component } from 'react'
import ReactTable from 'react-table'
import CategoryButton from './CategoryButton'
import 'react-table/react-table.css' 

class TransactionsTable extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      page: 0,
      sorted: []
    }
    this.modalHidden = this.modalHidden.bind(this)
  }

  componentDidMount() {
    document.addEventListener('hidden', this.modalHidden)
  }

  componentWillUnmount() {
    document.removeEventListener('hidden', this.modalHidden)
  }

  componentDidUpdate () {
    if (this.props.resetPage) {
      this.setState({
        page: 0,
        sorted: []
      })
      this.props.falseResetPage()
    }
  }

  modalHidden() {
    this.props.forceUpdate()
  }

  render() {
    const columns = [{
      accessor: 'id',
      show: false 
    },{
      Header: 'Date',
      accessor: 'Date',
      maxWidth: 110
    },{
      Header: 'Type',
      accessor: 'Type',
      maxWidth: 50
    },{
      Header: 'Description',
      accessor: 'Description',
      minWidth: 150
    },{
      Header: 'Value',
      accessor: 'Value',
      maxWidth: 100
    },{
      Header: 'Balance',
      accessor: 'Balance',
      maxWidth: 100
    },
    {
      Header: 'Category',
      accessor: 'categoryName',
      maxWidth: 120,
      Cell: CategoryButton
    }]

    return (
      <ReactTable
        data={this.props.data}
        columns={columns} 
        showPagination={true}
        showPageSizeOptions={false}
        page={this.state.page}
        onPageChange={page => this.setState({ page })}
        sorted={this.state.sorted}
        onSortedChange={sorted => this.setState({ sorted })}
        key={10}
        defaultPageSize={8}
        style={{ height: '500px'}} />
    )
  }
}

export default TransactionsTable