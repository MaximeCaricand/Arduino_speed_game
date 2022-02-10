import Game from '../components/Game';
import Graph from '../components/Graph';
import Head from 'next/head';
import { Component } from 'react';
import { ILedMessageData, IScoreData, MessageHeader } from '../utils/model/MessageData.model';
import Highcharts from 'highcharts';
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge";

if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

export default class Home extends Component<{}, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      curLed: 0,
      curTime: 0,
      avgTime: 0,
      distribution: {
        red: 0,
        yellow: 0,
        green: 0
      }
    }
  }

  updateState(newState: any) {
    this.setState((state: any) => (Object.assign({}, state, newState)));
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:3100`);
    ws.onopen = () => console.log("ws opened");
    ws.onerror = (e) => console.log(e);
    ws.onmessage = (event) => {
      const data: IScoreData | ILedMessageData = JSON.parse(event.data);
      switch (data.type) {
        case MessageHeader.LED:
          this.setState({ curLed: data.curLed });
          break;
        case MessageHeader.SCORE:
          this.setState({
            curLed: -1,
            curTime: data.curTime,
            avgTime: data.avgTime,
            distribution: data.distribution
          });
          break;
      }
    };
  }

  render() {
    return (
      <>
        <Head>
          <title>Awesome speed game</title>
        </Head>
        <header>
          <nav className="navbar text-center d-block navbar-dark bg-dark mx-auto">
            <h1 className="h2 text-light my-1">Awesome speed game</h1>
          </nav>
        </header>
        <main>
          <div className="container h-100 mt-5 mb-5">
            <div className='row'>
              <Game Highcharts={Highcharts} curLed={this.state.curLed} curTime={this.state.curTime} avgTime={this.state.avgTime} />
              <Graph Highcharts={Highcharts} distribution={this.state.distribution} />
            </div>
          </div>
        </main>
        <footer className="fixed-bottom py-3 bg-dark text-white-50">
          <div className="container text-center">
            <h6 className="w-100 text-center">© Copyright 2022 - Henry Florian & Maxime Caricand - Projet Arduino IoT</h6>
          </div>
        </footer>
      </>
    )
  }
}