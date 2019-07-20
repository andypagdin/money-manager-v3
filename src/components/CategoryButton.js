import React, { Component } from 'react'

class CategoryButton extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    document.getElementById('edit-category-modal').setAttribute('transaction-id', this.props.row.id)
  }

  render () {
    return <div onClick={this.handleClick} uk-toggle="target: #edit-category-modal" className={'category-label category-' + this.props.value.toLowerCase().replace(' ', '')}>{this.props.value}</div>
  }
}

export default CategoryButton