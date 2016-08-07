import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import Writing from './components/Writing'
import Links from './components/Links'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/writing" component={Writing} />
      <Route path="/links" component={Links} />
    </Route>
  </Router>
), document.querySelector('#root'))
