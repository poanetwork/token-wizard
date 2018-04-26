import React from 'react';
import '../../assets/stylesheets/application.css';
import classNames from 'classnames'

const ReservedTokensItem = props => {
  return (
    <div className="reserved-tokens-item-container">
      <div className={classNames('reserved-tokens-item-container-inner', { 'monospace': props.readOnly })}>
        <span className="reserved-tokens-item reserved-tokens-item-left">{props.addr}</span>
        <span className="reserved-tokens-item reserved-tokens-item-middle">{props.dim}</span>
        <span className="reserved-tokens-item reserved-tokens-item-right">{props.val}</span>
      </div>
      {props.readOnly
        ? null
        : <div className="reserved-tokens-item-empty">
          <a onClick={() => props.onRemove(props.num)}>
            <span className="item-remove"/>
          </a>
        </div>
      }
    </div>
  );
};

export default ReservedTokensItem;
