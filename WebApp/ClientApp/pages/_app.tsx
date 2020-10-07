import React from "react"

import "styles/site.css"
import "styles/NavMenu.css"
import "bootstrap/dist/css/bootstrap.css"
import { Provider } from "react-redux"
import store from "app/store"
import Layout from "components/Layout"

const App = ({ Component, pageProps }) => (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
)
export default App
