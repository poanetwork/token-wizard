import CrowdsalesList from '../Common/CrowdsalesList'
import React, { Component } from 'react'
import logdown from 'logdown'
import { CrowdsaleEmptyList } from './CrowdsaleEmptyList'
import { Loader } from '../Common/Loader'
import { checkWeb3ForErrors, getCurrentAccount, loadRegistryAddresses } from '../../utils/blockchainHelpers'
import { clearStorage, navigateTo } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
import { reloadStorage } from '../Home/utils'
import { SectionInfo } from '../Common/SectionInfo'
import { ManageNavigation } from '../Common/ManageNavigation'
import { MANAGE_SECTIONS } from '../../utils/constants'

const logger = logdown('TW:CrowdsalesList')
const { CROWDSALE_LIST } = MANAGE_SECTIONS

@inject('crowdsaleStore', 'web3Store', 'generalStore', 'contractStore')
@observer
export class Crowdsales extends Component {
  state = {
    account: null,
    crowdsales: [],
    loading: false
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

      return (
        <div>
          <section className="lo-MenuBarAndContent">
            <ManageNavigation activeStepTitle={CROWDSALE_LIST} navigationSteps={MANAGE_SECTIONS} />
            <div className="st-StepContent">
              <SectionInfo
                description="The list of your updatable crowdsales. Choose crowdsale address, click Continue and you’ll
                be able to update the parameters of crowdsale."
                stepNumber="0"
                title={CROWDSALE_LIST}
              />
              {crowdsales.length === 0 && !loading ? (
                <CrowdsaleEmptyList account={account} />
              ) : (
                <CrowdsalesList crowdsales={crowdsales} history={history} />
              )}
            </div>
          </section>
          <Loader show={loading} />
        </div>
      )
    }
  }
}
