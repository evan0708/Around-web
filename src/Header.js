import React from 'react';
import logo from './logo.svg';

export class Header extends React.Componet {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Around</h1>
            </header>
        );
    }
}