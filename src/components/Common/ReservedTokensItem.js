import React from 'react';
import '../../assets/stylesheets/application.css';

const ReservedTokensItem = props => {
  return (
    <div className={'reserved-tokens-item-container'}>
      <div className="reserved-tokens-item-container-inner">
        <span className="reserved-tokens-item reserved-tokens-item-left">{props.addr}</span>
        <span className="reserved-tokens-item reserved-tokens-item-middle">{props.dim}</span>
        <span className="reserved-tokens-item reserved-tokens-item-right">{props.val}</span>
      </div>
      <div className="reserved-tokens-item-empty">
        <a onClick={() => props.onRemove(props.num)}>
          <span className="item-remove" />
        </a>
      </div>
    </div>
  );
};

export default ReservedTokensItem;
