import React from "react"
import { HashRouter as Router, Route } from "react-router-dom"
import Navbar from './Navbar'
import HomePage from '../pages/HomePage'
import UploadPage from '../pages/UploadPage'
import SettingsPage from "../pages/SettingsPage"
import { ToastContainer } from 'react-toastify'
import EditCategoryModal from './EditCategoryModal'
import 'react-toastify/dist/ReactToastify.css'
import "../styles/App.css"

const App = () => {
  return(
    <Router>
      <ToastContainer />
      <div id="main-container" uk-height-viewport="true">
        <Navbar />
        <div className="wrapper">
          <Route path="/" exact component={HomePage} />
          <Route path="/upload/" component={UploadPage} />
          <Route path="/settings/" component={SettingsPage} />
        </div>
        <EditCategoryModal />
      </div>
    </Router>
  )
}

export default App