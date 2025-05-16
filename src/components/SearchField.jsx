import { useEffect, useState } from 'react';

export default function SearchField({
  label, // Label for the input field
  placeholder = 'Suchen...', // Placeholder text for the input field
  delay = 500, // Debounce delay in milliseconds
  value = '', // Controlled value for the input field
  onChange = () => {}, // Callback for value changes (debounced)
  onEnter = () => {}, // Callback for Enter key press
  className = '', // Additional CSS classes for styling
}) {
  
  const [localValue, setLocalValue] = useState(value); // Local state to manage input value

  // Sync internal value whenever the `value` prop changes (e.g., resets or external updates)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the `onChange` callback to limit how often it is called
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue); // Call the `onChange` callback with the current value
    }, delay);
    return () => clearTimeout(handler); // Cleanup the timeout on value or delay change
  }, [localValue, delay, onChange]);

  // Handle the Enter key press to trigger the `onEnter` callback
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEnter(localValue); // Call the `onEnter` callback with the current value
    }
  };

  return (
    <div className="form-control w-full">
      {label && (
        // Render the label if provided
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={localValue} // Bind the input to the local state
          onChange={(e) => setLocalValue(e.target.value)} // Update local state on input change
          onKeyDown={handleKeyDown} // Handle key press events
          placeholder={placeholder} // Set the placeholder text
          className={`input input-bordered w-full pr-10 ${className}`} // Apply styling
        />
        {/* Search icon positioned inside the input field */}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          🔍
        </span>
      </div>
    </div>
  );
}
