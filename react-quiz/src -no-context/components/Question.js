import Options from './Options';

function Question({ question, dispatch, answer }) {
  if (!question) return <p>No question available</p>;

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
