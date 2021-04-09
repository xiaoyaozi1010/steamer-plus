import React, { Component } from "react"
import { render } from 'react-dom';
import Header from '../../components/pc/Header';
import Footer from '../../components/common/Footer';
import logo from './logo.svg';
import './index.css';
const abc = import('./test');

class Container extends Component {
    testFn = () => {
        console.log('testdddddd');
        abc.then(_ => {
            console.log(_.default);
            _.default();
        })
        const testObj = { a: 1, b: 2, };
        console.log({
            ...testObj,
            c: 3,
        })
    }
    static getInstance = () => {
        console.log('hello world');
    }
    render() {
        return (
            <div className="App">
                <Header />
                <header className="App-header">
                    <img
                        onClick={this.testFn}
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
                        Learn React Again xxx
                    </a>
                </header>
                <Footer />
            </div>
        );
    }
}

render(<Container />, document.getElementById("pages"));

