import React, { useEffect } from 'react';

// TextField component for rendering an input field with optional label, error message, and focus handling
export default function TextField({
  ref, // Reference to the input element for direct DOM manipulation
  label, // Label text for the input field
  value, // Controlled value for the input field
  onChange, // Callback function to handle input value changes
  error, // Error message to display below the input field
  className = '', // Additional CSS classes for styling
  placeholder = '', // Placeholder text for the input field
  type = 'text', // Input type (e.g., text, password, email)
  ...props // Spread operator to pass additional props to the input element
}) {
  
  // Automatically focus the input field when the component is mounted
  useEffect(() => {
    if (ref.current) {
      ref.current.focus(); // Focus the input field
    }
  }, [ref]); // Dependency array ensures this effect runs only once on mount

  return (
    <div className="form-control w-full">
      {/* Render the label if provided */}
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      {/* Input field */}
      <input
        ref={ref} // Attach the ref to the input element
        type={type} // Set the input type
        value={value} // Bind the input value to the controlled state
        onChange={onChange} // Handle input value changes
        placeholder={placeholder} // Set the placeholder text
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`} // Apply conditional styling for errors
        {...props} // Pass additional props to the input element
      />
      {/* Display error message if provided */}
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
