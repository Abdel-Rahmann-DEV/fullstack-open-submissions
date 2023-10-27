function Button({ handleClick }) {
   return (
      <div className="give-feedback">
         <h1>give feedback</h1>
         <button onClick={() => handleClick("good")}>good</button>
         <button onClick={() => handleClick("neutral")}>neutral</button>
         <button onClick={() => handleClick("bad")}>bad</button>
      </div>
   );
}

export default Button;
