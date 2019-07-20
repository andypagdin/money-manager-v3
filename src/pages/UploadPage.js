import React, { Component } from 'react'
import FileUploadInput from '../components/FileUploadInput'
import FileUploadButton from '../components/FileUploadButton'

class UploadPage extends Component {
  constructor(props) {
    super(props)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.state = {
      selectedFile: null
    }
  }

  handleFileChange = (file) => {
    this.setState({
      selectedFile: file
    })
  }

  render() {
    return (
      <div className="js-upload" uk-form-custom="true">
        <FileUploadInput file={this.state.selectedFile} onChange={this.handleFileChange}/>
        <p />
        <FileUploadButton file={this.state.selectedFile}/>
      </div>
    )
  }
}

export default UploadPage
