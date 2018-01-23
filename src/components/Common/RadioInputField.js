import React from 'react';
import '../../assets/stylesheets/application.css';

export class RadioInputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.defaultValue || this.props.items[0].value
    };
  }

  onChange = (e) => {
    const item = e.target.value
    this.setState({
      checked: item
    });
    this.props.onChange(e);
  }

  render() {
    const inputs = this.props.items
      .map((item, index) => (
        <label className="radio-inline" key={index}>
          <input
            type="radio"
            checked={this.state.checked === item.value}
            onChange={this.onChange}
            value={item.value}
          />
          <span className="title">{item.label}</span>
        </label>
      ))

    return (
      <div className={this.props.extraClassName}>
        <label className="label">{this.props.title}</label>
        <div className="radios-inline">
          { inputs }
        </div>
        <p className="description">{this.props.description}</p>
      </div>
    );
  }
}
