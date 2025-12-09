import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TrekForm from '../components/TrekForm';
import { toast } from 'react-toastify';

const AddTrekPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    location: '',
    difficulty: '',
    price: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        location: values.location,
        difficulty: values.difficulty,
        price: Number(values.price),
        images: values.images,
      };
      await api.post('/treks', payload);
      toast.success('Trek created');
      navigate('/treks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrekForm
      title="Add Trek"
      values={values}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default AddTrekPage;
