import React from 'react'
import '../../assets/stylesheets/application.css'

export const ModalContainer = (props) => {
  if (props.showModal)
    return (
      <div className="crowdsale-modal loading-container">
        <div className='modal'>
          {props.title
            ? <p className='title'>{props.title}</p>
            : null
          }
          {props.description
            ? <p className='description'>{props.description}</p>
            : null
          }
          {props.children}
          {props.hideModal
            ? <div className='close-button' onClick={() => props.hideModal()}><i className="icon"/></div>
            : null
          }
        </div>
      </div>
    )
  return null
}
