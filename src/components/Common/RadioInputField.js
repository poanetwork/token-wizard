import React from 'react'
import '../../assets/stylesheets/application.css';

export class RadioInputField extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	"checked1": props.defaultValue==this.props.vals[0]?true:false, 
        	"checked2": props.defaultValue==this.props.vals[0]?false:true
        }
    }

    onChange(e) {
    	console.log(e.target);
    	this.setState({
    		"checked1": e.target.value==this.props.vals[0]?true:false, 
    		"checked2": e.target.value==this.props.vals[0]?false:true});
    	this.props.onChange(e);
    }

	render() {
		return (<div className={this.props.side}>
		<label className="label">{this.props.title}</label>
		<div className="reserved-tokens-radio-container">
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name={this.props.name} className="input-radio" checked={this.state.checked1} value={this.props.vals[0]} onChange={this.onChange.bind(this)}/> {this.props.items[0]}
			</div>
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name={this.props.name} className="input-radio" checked={this.state.checked2} value={this.props.vals[1]} onChange={this.onChange.bind(this)}/> {this.props.items[1]}
			</div>
		</div>
		<p className="description">
			{this.props.description}
		</p>
		</div>)
	}
}