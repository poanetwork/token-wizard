import React from 'react'
import '../../assets/stylesheets/application.css';

export class DisplayTextArea extends React.Component {
	constructor(props) {
    	super(props);
	}

	render() {
  	return (
      <div key={this.props.key?this.props.key:""} className="item">
        <p className="label">{this.props.label}</p>
        <pre>
          {this.props.value}
        </pre>
        <p className="description">
          {this.props.description}
        </p>
      </div>)
  }
}

