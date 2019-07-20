import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

class FileUploadInput extends Component {
  constructor(props) {
    super(props)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  handleFileChange = event => {
    if (event.target.files[0]['type'] !== 'text/csv') {
      toast.error('Incorrect file type')
      return false
    }
    this.props.onChange(event.target.files[0])
  }

  render() {
    let fileData = ''
    if (this.props.file !== null) {
      fileData = <ul>
        <li>Name: {this.props.file['name']}</li>
        <li>Size: {this.props.file['size']} KB</li>
        <li>Path: {this.props.file['path']}</li>
        <li>Type: {this.props.file['type']}</li>
      </ul>
    }

    return (
      <Fragment>
        <div className="js-upload" uk-form-custom="true">
          <input type="file" onChange={this.handleFileChange} />
          <button className="uk-button uk-button-default"><FontAwesomeIcon className="margin-right-5" icon={faUpload} />Select File</button>
        </div>
        {fileData}
      </Fragment>
    )
  }
}

export default FileUploadInput