import React, { Component } from 'react';
import { render } from 'react-dom';
import Header from '../../components/mobile/Header';
import Footer from '../../components/common/Footer';

class Container extends Component {
    render() {
        return (
            <div className= "main" >
                <Header />
                <Footer />
            </div>
        )
    }
}

render(<Container />, document.getElementById('pages'));

