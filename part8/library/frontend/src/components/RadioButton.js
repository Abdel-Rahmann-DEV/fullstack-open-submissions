import React from 'react';
import '../styles/radioButton.css';

const RadioButton = ({ category, value, handleChange }) => {
  return (
    <div>
      <ul>
        {category.map((e, i) => (
          <li key={i}>
            <input
              type="radio"
              id={`radio-${i}`}
              value={e.value}
              checked={value === e.value}
              onChange={() => handleChange(e.value)}
            />
            <label htmlFor={`radio-${i}`}>{e.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioButton;
