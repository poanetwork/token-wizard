import React from 'react'
import '../../assets/stylesheets/application.css';

export class DisplayTextArea extends React.Component {
	constructor(props) {
    	super(props);
	}

	render() {
  	return (
      <div key={this.props.key?this.props.key:""} className="item">
        <div>
          <div className="display-container">
            <p className="label">{this.props.label}</p>
          </div>
          <div className="copy-area-container">
            <btn className="copy" data-clipboard-action="copy" data-clipboard-text={this.props.value}></btn>
          </div>
        </div>
        <pre>
          {this.props.value}
        </pre>
        <p className="description">
          {this.props.description}
        </p>
      </div>
    )
  }
}