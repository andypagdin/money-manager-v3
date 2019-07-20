import React, { Component } from 'react'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import moment from 'moment'
import { Redirect } from "react-router-dom"

class FileUploadButton extends Component {
  constructor(props) {
    super(props)
    this.state = { redirectHome: false }
    this.handleClick = this.handleClick.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  handleClick = () => {
    if (this.props.file === null) {
      toast.error('No file chosen')
      return false
    } 
    this.uploadFile(this.props.file)
      .then(() => this.setState({ redirectHome: true }))
  }

  uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        error: function(err) {
          toast.error(err)
        },
        complete: function(results) {
          let cleanedData = []
          const data = results.data
          for (let i = 0; i < data.length; i++) {
            let obj = {}
      
            obj.Date = new moment(data[i].Date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            obj.AccountName = data[i]['Account Name'].replace("'", '')
            obj.AccountNumber = data[i]['Account Number'].replace("'", '')
            obj.Balance = data[i]['Balance']
            obj.Description = data[i]['Description'].replace("'", '')
            obj.Type = data[i]['Type']
            obj.Value = data[i]['Value']
            obj.categoryId = 7
  
            cleanedData.push(obj)
          }
  
          let classifiedData = window.ipcRenderer.sendSync('classify-transactions', cleanedData)

          const chunkedClassifiedData = []
          let index = 0
          let size = 100
          while (index < classifiedData.length) {
            chunkedClassifiedData.push(classifiedData.slice(index, size + index))
            index += size
          }

          let chunksInserted = 0
          for (let j = 0; j < chunkedClassifiedData.length; j++) {
            if(window.ipcRenderer.sendSync('insert-query', 'transaction', chunkedClassifiedData[j])) {
              chunksInserted += 1
            }
          }

          if(chunksInserted === chunkedClassifiedData.length) {
            toast.success('Upload successful')
            resolve()
          } else {
            toast.error('Upload failed!')
            reject()
          }
        }
      })
    })
  }

  render() {
    if (this.state.redirectHome) return <Redirect to={'/'} />
    return (
      <button 
        className="uk-button uk-button-primary" 
        onClick={this.handleClick} 
        style={{visibility: this.props.file === null ? 'hidden' : 'visible'}}>
          Upload
      </button>
    )
  }
}

export default FileUploadButton