import type { NextPage } from 'next';
import Game from '../components/Game';
import Head from 'next/head'

const Home: NextPage = () => {
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
        <div className="container h-100">
          <Game />
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

export default Home