import React from 'react'
import '../../assets/stylesheets/application.css';

export class RadioInputField extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		return (<div className={this.props.side}>
		<label className="label">{this.props.title}</label>
		<div className="reserved-tokens-radio-container">
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name="radio-input" className="input-radio" value={this.props.vals[0]} checked={(this.props.target == this.props.vals[0])?true:false} onChange={this.props.onChange}/> {this.props.items[0]}
			</div>
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name="radio-input" className="input-radio" value={this.props.vals[1]} checked={(this.props.target == this.props.vals[1])?true:false} onChange={this.props.onChange}/> {this.props.items[1]}
			</div>
		</div>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
		</div>)
	}
}