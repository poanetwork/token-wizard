import React from 'react'

export const ModalContainer = props => {
  if (props.showModal)
    return (
      <div className="sw-FullscreenBackdrop sw-FullscreenBackdrop-CenterItems">
        <div className="sw-ModalWindow">
          {props.title ? <p className="title">{props.title}</p> : null}
          {props.description ? <p className="description">{props.description}</p> : null}
          {props.children}
          {props.hideModal ? (
            <div className="close-button" onClick={() => props.hideModal()}>
              <i className="icon" />
            </div>
          ) : null}
        </div>
      </div>
    )
  return null
}
