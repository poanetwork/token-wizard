import React from 'react';
import Web3 from 'web3';
import '../../assets/stylesheets/application.css';
import {InputField} from './InputField';
import {RadioInputField} from './RadioInputField';
import {TEXT_FIELDS, VALIDATION_TYPES} from '../../utils/constants';
import ReservedTokensItem from './ReservedTokensItem';
import update from 'immutability-helper';
import {inject, observer} from 'mobx-react';
const {VALID, INVALID} = VALIDATION_TYPES;

const {ADDRESS, DIMENSION, VALUE} = TEXT_FIELDS;

@inject('reservedTokenStore') @observer
export class ReservedTokensInputBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addr: '',
      dim: 'tokens',
      val: '',
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        }
      }
    }
  }

  clearInput() {
    this.setState({
      addr: '',
      dim: 'tokens',
      val: ''
    })
  }

  updateReservedTokenInput = (event, property) => {
    const value = event.target.value;
    this.setState({
      [property]: value
    });
  };

  addReservedTokensItem = () => {
    const { addr, dim, val } = this.state

    this.setState(update(this.state, {
      validation: {
        address: {
          pristine: { $set: false }
        }
      }
    }))

    if (!addr || !dim || !val || this.state.validation.address.valid === INVALID) {
      return;
    }

    this.setState(update(this.state, {
      validation: {
        address: {
          $set: {
            pristine: true,
            valid: INVALID
          }
        }
      }
    }))

    this.clearInput();

    let newToken = {
      addr: addr,
      dim: dim,
      val: val,
    };

    if (!this.props.reservedTokenStore.findToken(newToken)) {
      this.props.reservedTokenStore.addToken(newToken);
    }
  };

  removeReservedToken = index => {
    this.props.reservedTokenStore.removeToken(index);
  };

  handleReservedTokensInputDimChange = e => {
    this.props.onChange(e, 'token', 0, 'reservedtokens_dim');
    this.setState(
      update(this.state, {
        token: {
          reservedTokensInput: {
            dim: {
              $set: e.target.value,
            },
          },
        },
      }),
    );
  };

  handleReservedTokensInputValChange = e => {
    this.props.onChange(e, 'token', 0, 'reservedtokens_val');
    this.setState(
      update(this.state, {
        token: {
          reservedTokensInput: {
            val: {
              $set: e.target.value,
            },
          },
        },
      }),
    );
  };

  handleAddressChange = e => {
    const address = e.target.value
    const isAddressValid = Web3.utils.isAddress(address) ? VALID : INVALID;

    const newState = update(this.state, {
      validation: {
        address: {
          $set: {
            pristine: false,
            valid: isAddressValid
          },
        },
      },
    });
    newState.addr = address

    this.setState(newState)
  }

  render() {
    const reservedTokensElements = this.props.reservedTokenStore.tokens.map((token, index) => {
      return (
        <ReservedTokensItem
          key={index.toString()}
          num={index}
          addr={token.addr}
          dim={token.dim}
          val={token.val}
          onRemove={index => this.removeReservedToken(index)}
        />
      );
    });

    return (
      <div className="reserved-tokens-container">
        <div className="reserved-tokens-input-container">
          <div className="reserved-tokens-input-container-inner">
            <InputField
              side="reserved-tokens-input-property reserved-tokens-input-property-left"
              type="text"
              title={ADDRESS}
              value={this.state.addr}
              onChange={e => this.handleAddressChange(e)}
              description={`Address where to send reserved tokens.`}
              pristine={this.state.validation.address.pristine}
              valid={this.state.validation.address.valid}
              errorMessage="The inserted address is invalid"
            />
            <RadioInputField
              extraClassName="reserved-tokens-input-property reserved-tokens-input-property-middle"
              title={DIMENSION}
              items={[{ label: 'tokens', value: 'tokens' }, { label: 'percentage', value: 'percentage' }]}
              selectedItem={this.state.dim}
              onChange={e => this.updateReservedTokenInput(e, 'dim')}
              description={`Fixed amount or % of crowdsaled tokens. Will be deposited to the account after fintalization of the crowdsale. `}
            />
            <InputField
              side="reserved-tokens-input-property reserved-tokens-input-property-right"
              type="number"
              title={VALUE}
              value={this.state.val}
              onChange={e => this.updateReservedTokenInput(e, 'val')}
              description={`Value in tokens or percents. Don't forget to press + button for each reserved token.`}
            />
          </div>
          <div className="plus-button-container">
            <div onClick={e => this.addReservedTokensItem()} className="button button_fill button_fill_plus" />
          </div>
        </div>
        {reservedTokensElements}
      </div>
    );
  }
}
