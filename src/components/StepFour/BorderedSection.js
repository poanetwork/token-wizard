import React from 'react'

export const BorderedSection = ({ ...props }) => {
  const sectionTitle = props.title ? <h2 className="sw-BorderedSection_Title">{props.title}</h2> : null
  const sectionText = props.text ? <p className="sw-BorderedSection_Text">{props.text}</p> : null

  return (
    <div className="sw-BorderedSection" key={props.key} data-step={props.dataStep}>
      {sectionTitle}
      {sectionText}
      {props.contents}
    </div>
  )
}
