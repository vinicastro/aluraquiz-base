import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';

import db from '../db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import QuizBackground from '../src/components/QuizBackground';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <meta property="og:image" content={db.bg} />
        <title>AluraQuiz - Modelo Base</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>Aleatoriedades Biológicas</h1>
          </Widget.Header>
          <Widget.Content>
            <form onSubmit={function (event) {
              event.preventDefault();

              router.push(`/quiz?name=${name}`);
              console.log('Submiting form using React');
            }}
            >
              <Input
                name="nomeDoUsuario"
                onChange={(event) => {
                  setName(event.target.value);
                }}
                placeholder="Diz ai seu nome!"
                value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                {`E aí ${name} !? Bora jogar?`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>
        <Widget>
          <Widget.Content>
            <h1>Quizes da Galera</h1>
            <p>lorem ipsulum...</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/vinicastro" />
    </QuizBackground>
  );
}
