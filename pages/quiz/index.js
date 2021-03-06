/* eslint-disable react/prop-types */
import React from 'react';
import Lottie from 'react-lottie';

import db from '../../db.json';
import Widget from '../../src/components/Widget';
import QuizBackground from '../../src/components/QuizBackground';
import QuizLogo from '../../src/components/QuizLogo';
import Button from '../../src/components/Button';
import QuizContainer from '../../src/components/QuizContainer';
import AlternativesForm from '../../src/components/AlternativesForm';
import BackLinkArrow from '../../src/components/BackLinkArrow';
import animationData from '../../src/animation.json';

function ResultWidget({ results }) {
  const correctAnswers = results.reduce((sumCorrectAnswers, result) => {
    if (result === true) {
      return sumCorrectAnswers + 1;
    }
    return sumCorrectAnswers;
  }, 0);
  const customMessage = results.length === correctAnswers ? ' É o bichão memo hein!?' 
                              : correctAnswers === 0 ? ' Você ta gastando muito dinheiro em leite condensado hein?' 
                              : ' BOOOOOA!';
  return (
    <Widget>
      <Widget.Header>
        Resultado
      </Widget.Header>
      <Widget.Content>
        <p>{`Você acertou ${correctAnswers} questões.${customMessage}`}</p>
        <ul>
          {results.map((result, resultIndex) => (
            <li key={`result__${resultIndex + 1}`}>
              {`#${resultIndex + 1} Resultado: ${result === true ? 'Acertou' : 'Errou'}`}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        <Lottie
          options={defaultOptions}
          isStopped={false}
          isPaused={false}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestions,
  questionIndex,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternativeState] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmitedState] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative === undefined;
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>
        <AlternativesForm
          onSubmit={(event) => {
            event.preventDefault();
            setIsQuestionSubmitedState(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmitedState(false);
              setSelectedAlternativeState(undefined);
            }, 1.5 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  checked={isSelected}
                  id={alternativeId}
                  type="radio"
                  name={questionId}
                  onChange={() => {
                    setSelectedAlternativeState(alternativeIndex);
                  }}
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button
            type="submit"
            disabled={hasAlternativeSelected}
          >
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Você Acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você Errou!</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [results, setResultsState] = React.useState([]);
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [currentQuestion, setCurrentQuestionIndexState] = React.useState(0);

  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const totalQuestions = db.questions.length;

  function addResult(result) {
    setResultsState([
      ...results,
      result,
    ]);
  }
  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3 * 1000);
  }, []);
  function handleSubmitQuiz() {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestionIndexState(currentQuestion + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }
  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        { screenState === screenStates.QUIZ && (
        <QuestionWidget
          question={question}
          totalQuestions={totalQuestions}
          questionIndex={questionIndex}
          onSubmit={handleSubmitQuiz}
          addResult={addResult}
        />
        )}
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
