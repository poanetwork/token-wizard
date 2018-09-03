import React from 'react'

export const ModalContainer = props => {
  if (props.showModal)
    return (
      <div className="sw-ModalWindowBackdrop">
        <div className="sw-ModalWindow">
          {props.title ? (
            <h2 className="sw-ModalWindow_Title">
              {props.title}{' '}
              {props.hideModal ? (
                <div className="sw-ModalWindow_CloseButton" onClick={() => props.hideModal()} />
              ) : null}
            </h2>
          ) : null}
          {props.description ? <p className="sw-ModalWindow_description">{props.description}</p> : null}
          {props.children}
        </div>
      </div>
    )
  return null
}
