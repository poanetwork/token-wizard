import React from 'react'
import '../../assets/stylesheets/application.css';

export class RadioInputField extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		console.log(this.props.target);
		return (<div className={this.props.side}>
		<label className="label">{this.props.title}</label>
		<div className="reserved-tokens-radio-container">
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name={this.props.name} className="input-radio" checked={(this.props.target == this.props.vals[0])?true:false} value={this.props.vals[0]} onChange={this.props.onChange}/> {this.props.items[0]}
			</div>
			<div className="reserved-tokens-radio-container-item">
				<input disabled={this.props.disabled} type='radio' name={this.props.name} className="input-radio" checked={(this.props.target == this.props.vals[1])?true:false} value={this.props.vals[1]} onChange={this.props.onChange}/> {this.props.items[1]}
			</div>
		</div>
		<p className="description">
			{this.props.description}
		</p>
		</div>)
	}
}