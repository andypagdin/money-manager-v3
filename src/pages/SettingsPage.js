import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { Redirect } from "react-router-dom"

// For now the assumption is made that all settings are inputs of type text
class SettingsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      waterSupplier: '',
      energySupplier: '',
      redirectHome: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const settings = window.ipcRenderer.sendSync('get-settings')
    for (let i = 0; i < settings.length; i++) {
      this.setState({
        [settings[i].name]: settings[i].value
      })
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit(event) {
    const settings = [
      { name: 'waterSupplier', value: this.state.waterSupplier },
      { name: 'energySupplier', value: this.state.energySupplier }
    ]

    let updatedRows = 0
    for (let i = 0; i < settings.length; i++) {
      updatedRows += window.ipcRenderer.sendSync('update-setting', settings[i])
    }
    
    if (updatedRows > 0) {
      toast.success('Settings saved')
    } else {
      toast.error('Failed to update settings')
    }

    this.setState({ redirectHome: true })
    event.preventDefault()
  }

  render() {
    if (this.state.redirectHome) return <Redirect to={'/'} />
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="waterSupplier">Water Supplier</label>
          <div className="uk-form-controls">
              <input className="uk-input" id="waterSupplier" type="text" value={this.state.waterSupplier} onChange={this.handleChange} />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="energySupplier">Energy Supplier</label>
          <div className="uk-form-controls">
              <input className="uk-input" id="energySupplier" type="text" value={this.state.energySupplier} onChange={this.handleChange} />
          </div>
        </div>
        <p />
        <input type="submit" value="Save" className="uk-button uk-button-primary" />
      </form>
    )
  }
}

export default SettingsPage