import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Index from './pages/AccountList/index'

const App = () => <div>
  <Index />
</div>

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
