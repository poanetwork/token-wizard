import React from 'react'
import '../../assets/stylesheets/application.css';
import { VALIDATION_TYPES } from '../../utils/constants'
import { observer } from 'mobx-react'
const { INVALID } = VALIDATION_TYPES


@observer export class InputField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	clearVal = () => {
		let state = {...this.state}
		state.val = ""
		this.setState(state)
	}

	onChange = (e) => {
		let state = {...this.state}
		state.val = e.target.value;
		this.setState(state);
		this.props.onChange(e);
	}

	componentDidMount() {
		let state = {...this.state}
		state.val = this.props.value;
		this.setState(state);
	}

	render() {
		const errorStyle={
			color: 'red',
			fontWeight: 'bold',
			fontSize: '12px',
			width: '100%',
			height: '10px'
		}
		const error = this.props.valid === INVALID ? this.props.errorMessage : ''
		return (<div className={this.props.side}>
			<label className="label">{this.props.title}</label>
			<input ref={this.props.ref} disabled={this.props.disabled} type={this.props.type} className="input" onBlur={this.props.onBlur} value={this.props.value} defaultValue={this.props.defaultValue} onChange={this.onChange}/>
			<p className="description">
				{this.props.description}
			</p>
			<p style={errorStyle}>{error}</p>
		</div>)
	}
}