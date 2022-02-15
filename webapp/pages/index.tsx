import Game from '../components/Game';
import Graph from '../components/Graph';
import Head from 'next/head';
import { Component } from 'react';
import { ILedMessageData, IScoreData, MessageHeader } from '../utils/model/MessageData.model';
import Highcharts from 'highcharts';
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge";
import { Distribution, Message } from '../../server/src/database/models/MessageData.model';
import { Modal } from 'react-bootstrap';

if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

type HomeState = {
  gameStarted: boolean;
  curLed: number;
  curTime: number;
  avgTime: number;
  distribution: Distribution;
}

export default class Home extends Component<{}, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      gameStarted: false,
      curLed: -1,
      curTime: 0,
      avgTime: 0,
      distribution: {
        red: 0,
        yellow: 0,
        green: 0
      }
    }
  }

  updateState(newState: Partial<HomeState>) {
    this.setState((state: HomeState) => (Object.assign({}, state, newState)));
  }

  componentDidMount() {
    const ws = new WebSocket(`ws://localhost:3100`);
    ws.onopen = () => console.log("ws opened");
    ws.onerror = (e) => console.log(e);
    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      switch (data.type) {
        case MessageHeader.LED:
          this.setState({ curLed: data.curLed, gameStarted: true });
          break;
        case MessageHeader.SCORE:
          this.setState({
            curLed: -1,
            curTime: data.score,
            avgTime: data.avgScore,
            distribution: data.distribution,
            gameStarted: true
          });
          break;
        case MessageHeader.STOP: {
          this.setState({ gameStarted: false });
          break;
        }
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
            <h6 className="w-100 text-center">© Copyright 2022 - Florian Henry & Maxime Caricand - Projet Arduino IoT</h6>
          </div>
        </footer>

        <Modal show={!this.state.gameStarted} backdrop="static" keyboard={false} centered >
          <Modal.Body className="text-center">
            <strong>Awesome speed game</strong> is stopped
          </Modal.Body>
        </Modal>
      </>
    )
  }
}