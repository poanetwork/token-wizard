import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { reloadStorage } from '../Home/utils'
import { clearStorage, navigateTo } from '../../utils/utils'
import { checkWeb3ForErrors, getCurrentAccount, loadRegistryAddresses } from '../../utils/blockchainHelpers'
import logdown from 'logdown'
import { CrowdsaleEmptyList } from './CrowdsaleEmptyList'
import CrowdsalesList from '../Common/CrowdsalesList'
import { Loader } from '../Common/Loader'

const logger = logdown('TW:CrowdsalesList')

@inject('crowdsaleStore', 'web3Store', 'generalStore', 'contractStore')
@observer
export class Crowdsales extends Component {
  state = {
    account: null,
    crowdsales: [],
    loading: true
  }

  constructor(props) {
    super(props)

    if (localStorage.reload) {
      // We made a reload, to verify metamask inject web3 when is enabled
      delete localStorage.reload
      localStorage.clearStorage = true
      this.block = false
      window.location.reload()
    } else {
      this.block = true
    }
  }

  async componentDidMount() {
    if (this.block) {
      this.setState({
        loading: true
      })

      try {
        await checkWeb3ForErrors(() => {
          navigateTo({
            history: this.props.history,
            location: 'home'
          })
        })

        const { account, crowdsales } = await this.load()
        this.setState({
          account: account,
          crowdsales: crowdsales
        })
      } catch (e) {
        logger.log('An error has occurred', e.message)
      }

      this.setState({ loading: false })
    }
  }

  async load() {
    if (localStorage.clearStorage) {
      delete localStorage.clearStorage

      clearStorage(this.props)
      await reloadStorage(this.props)
    }

    await loadRegistryAddresses()
    const account = await getCurrentAccount()

    const { crowdsaleStore } = this.props

    return {
      account: account,
      crowdsales: crowdsaleStore.crowdsales
    }
  }

  render() {
    // Not render until reload
    if (!this.block) {
      return false
    } else {
      const { account, crowdsales, loading } = this.state
      const { history } = this.props

      if (crowdsales.length === 0 && !loading) {
        return <CrowdsaleEmptyList account={account} />
      }

      return (
        <div>
          <CrowdsalesList crowdsales={crowdsales} history={history} />
          <Loader show={loading} />
        </div>
      )
    }
  }
}
