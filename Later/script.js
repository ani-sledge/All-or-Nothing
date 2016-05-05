var Player = React.createClass({
	getInitialState: function() {
		return {editing: false, all: false, score: 0}
	},
	edit: function() {
		this.setState({editing: true});
	},
	save: function() {
		this.props.onChange(this.refs.newName.getDOMNode().value, this.props.index);
		this.setState({editing: false});
	},
	remove: function() {
		this.props.onRemove(this.props.index);
	},
	switchBet: function() {
		this.setState({all: !this.state.all});
	},
	renderDisplay: function() {
		var bet;
		if (this.state.all) {
			bet = "All";
		} else {
			bet = "Nothing";
		}
		return (
			<div className="col-md-4">
				<div className="player">
					<button onClick={this.edit} 
					  className="btn btn-sm btn-default glyphicon glyphicon-pencil"></button>
					<button onClick={this.remove}
					  className="btn btn-sm btn-default glyphicon glyphicon-trash"></button>
					{this.renderName()}
					<p>{this.state.score} 
						<span> Place</span>
					</p>
					<input type="checkbox" onChange={this.switchBet}/>
					<p>{bet}</p>
				</div>
			</div>
		);
	},
	renderName: function() {
		if (this.state.editing) {
			return this.renderForm();
		} else {
			return (
				<div>
				<p>{this.props.children}</p>
				</div>
			)
		}
	},
	renderForm: function() {
		return (
			<div>
			<input className="form-control" ref="newName" type="text" defaultValue={this.props.children}
			></input>
			<button onClick={this.save}className="btn-tool">Save</button>
			</div>
		)
	},
	render: function() {
		return this.renderDisplay();
	}
});

var Game = React.createClass({
	propTypes: {
		count: function(props, propName) {
			if (typeof props[propName] !== "number") {
				return new Error("Must be a number.");
			}
			if (props[propName] > 6) {
				return new Error("Can only create 6 players.");
			}
		}
	},
	getInitialState: function() {
		return {
			players: [
			]
		};
	},
	add: function(text) {
		var arr = this.state.players;
		arr.push(text);
		this.setState({players: arr});
	},
	update: function(newText, i) {
		var arr = this.state.players;
		arr[i] = newText;
		this.setState({players:arr});
	},
	remove: function(i) {
		var arr = this.state.players;
		arr.splice(i, 1);
		this.setState({players:arr})
	},
	eachPlayer: function(player, i) {
		return (
			<Player key={i}
				index={i}
				onChange={this.update}
				onRemove={this.remove}
			>{player}</Player>
		);
	},
	renderAdd: function() {
		if (this.state.players.length < 6) {
			return (
				<div>
				<button className="add-player btn btn-default btn-sm glyphicon glyphicon-plus"
					onClick={this.add.bind(null, "New Player")}></button>
				</div>
			)
		} else {
			return
		}
	},
	render: function() {
		return (
			<div>				
				<div className="sidebar col-sm-3 col-xs-12">
					<button className="btn btn-default btn-sidebar">New Game</button>
					<button className="btn btn-default btn-sidebar">Next Round</button>
				</div>
				<div className="container-fluid col-sm-9 col-xs-12">
					{this.state.players.map(this.eachPlayer)}
					{this.renderAdd()}
				</div>

			</div>
		);
	}

});


React.render(<Game/>, document.getElementById('main'));