import React, { Component } from 'react'
import { toast } from 'react-toastify'

class EditCategoryModal extends Component {
  constructor (props) {
    super(props)
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
  }

  handleCategoryClick (categoryId) {
    const transactionId = parseInt(document.getElementById('edit-category-modal').getAttribute('transaction-id'))
    const updatedCategory = window.ipcRenderer.sendSync('update-category', transactionId, categoryId)
    if (!updatedCategory) {
      toast.error('Failed to update category')
    }
  }

  render () {
    const categoryButtons = []
    const categories = window.ipcRenderer.sendSync('get-categories')

    for (let i = 0; i < categories.length; i++) {
      categoryButtons.push(
        <div onClick={this.handleCategoryClick.bind(this, categories[i].id)} key={i} className={'uk-modal-close edit-category-button category-label category-' + categories[i].Name.toLowerCase().replace(' ', '')}>{categories[i].Name}</div>
      )
    }

    return (
      <div id="edit-category-modal" uk-modal={'true'}>
        <div className="uk-modal-dialog uk-modal-body">
          {categoryButtons}
        </div>
      </div>
    )
  }
}

export default EditCategoryModal
