import React from 'react';
import ImageUploader from './ImageUploader';

const TrekForm = ({ title, values, loading, onChange, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="form-container">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={values.location}
          onChange={handleChange}
          required
        />
        <select
          name="difficulty"
          value={values.difficulty}
          onChange={handleChange}
          required
        >
          <option value="">Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
        <input
          name="price"
          type="number"
          min={0}
          placeholder="Price"
          value={values.price}
          onChange={handleChange}
          required
        />
        <ImageUploader
          images={values.images}
          onChange={(imgs) => onChange('images', imgs)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default TrekForm;
