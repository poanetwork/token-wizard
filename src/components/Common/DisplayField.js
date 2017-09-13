import React from 'react'
import '../../assets/stylesheets/application.css';

export class DisplayField extends React.Component {
	constructor(props) {
    	super(props);
	}

	render() {
	return (<div className={this.props.side}>
		<div className="display-container">
        	<p className="label">{this.props.title}</p>
        	<p className="value">{this.props.value}</p>
	        <p className="description">
	          {this.props.description}
	        </p>
        </div>
        <div className="copy-field-container">
        	<btn className="copy" data-clipboard-action="copy" data-clipboard-text={this.props.value}></btn>
        </div>
      </div>)
  	}
}

