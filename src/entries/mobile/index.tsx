import React, { Component } from "react";
import { render } from "react-dom";
import Header from "../../components/mobile/Header";
import Footer from "../../components/common/Footer";
import logo from "./logo.svg";
import "./index.css";

class Container extends Component {
    static getInstance = () => {
        console.log("hello world");
    };
    render() {
        return (
            <div className="container">
                <Header />
                <header className="App-header">
                    <img
                        src={logo}
                        className="App-logo"
                        alt="logo"
                    />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <Footer />
            </div>
        );
    }
}

render(<Container />, document.getElementById("pages"));
