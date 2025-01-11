import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import StarRating from './StarRating';

function Test() {
  const [movieRating, setMovieRating] = React.useState(0);

  return (
    <div>
      <StarRating
        color="blue"
        maxRating={10}
        onSetRating={setMovieRating} // Pass setMovieRating as the callback
      />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={10}
      size={24}
      onSetRating={(rating) => console.log("Rating set to:", rating)} // Added onSetRating
    />
    <StarRating
      className="test"
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
      defaultRating={3} // Fixed typo in "defaultRating"
      onSetRating={(rating) => console.log("Message rating set to:", rating)} // Added onSetRating
    />
    <Test />
  </React.StrictMode>
);
