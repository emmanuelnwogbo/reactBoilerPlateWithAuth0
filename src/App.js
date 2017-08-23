import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Github from "./Github";
import Header from "./Components/Header";
import Auth0Lock from "auth0-lock";

import Keys from "./keys";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			idToken: "",
			profile: {}
		};
	}

	static defaultProps = {
		clientID: Keys.clientID,
		domain: Keys.domain
	};

	componentWillMount() {
		//console.log(this);
		this.lock = new Auth0Lock(this.props.clientID, this.props.domain);

		this.lock.on("authenticated", authResult => {
			//console.log("this is the result", authResult);

			this.lock.getProfile(authResult.idToken, (error, profile) => {
				if (error) {
					return console.log(error);
				}

				//console.log(profile);
				this.setProfile(authResult.idToken, profile);
			});
		});
		this.grabProfile();
	}

	setProfile(idToken, profile) {
		localStorage.setItem(`idToken`, idToken);
		localStorage.setItem(`profile`, JSON.stringify(profile));

		this.setState({
			idToken: localStorage.getItem("idToken"),
			profile: JSON.parse(localStorage.getItem("profile"))
		});
	}

	grabProfile() {
		if (localStorage.getItem("idToken") != null) {
			this.setState(
				{
					idToken: localStorage.getItem("idToken"),
					profile: JSON.parse(localStorage.getItem("profile"))
				},
				() => {
					console.log(this.state);
				}
			);
		}
	}

	showLock() {
		this.lock.show();
	}

	logout() {
		this.setState(
			{
				idToken: "",
				profile: ""
			},
			() => {
				localStorage.removeItem("idToken");
				localStorage.removeItem("profile");
			}
		);
	}

	render() {
		let page;

		if (this.state.idToken) {
			page = <Github />;
		} else {
			page = "Click on Login to view Github Viewer";
		}
		return (
			<div className="App">
				<Header
					lock={this.lock}
					idToken={this.state.idToken}
					onLogout={this.logout.bind(this)}
					onLogin={this.showLock.bind(this)}
				/>
				{page}
			</div>
		);
	}
}

export default App;
