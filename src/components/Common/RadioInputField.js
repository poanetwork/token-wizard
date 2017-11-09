import React from 'react'
import '../../assets/stylesheets/application.css';

export class RadioInputField extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	"checked1": props.defaultValue===this.props.vals[0]?true:false,
        	"checked2": props.defaultValue===this.props.vals[0]?false:true
        }
    }

    onChange(e) {
    	console.log(e.target);
    	this.setState({
    		"checked1": e.target.value===this.props.vals[0]?true:false,
    		"checked2": e.target.value===this.props.vals[0]?false:true});
    	this.props.onChange(e);
    }

	render() {
		return (<div className={this.props.side}>
		<label className="label">{this.props.title}</label>
		<div className="radios-inline">
            <label className="radio-inline">
              <input
                type="radio"
                checked={this.state.checked1}
                name={this.props.name}
                onChange={this.onChange.bind(this)}
                value={this.props.vals[0]}
              />
              <span className="title">{this.props.items[0]}</span>
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                checked={this.state.checked2}
                name={this.props.name}
                onChange={this.onChange.bind(this)}
                value={this.props.vals[1]}
              />
              <span className="title">{this.props.items[1]}</span>
            </label>
          </div>
		<p className="description">
			{this.props.description}
		</p>
		</div>)
	}
}
