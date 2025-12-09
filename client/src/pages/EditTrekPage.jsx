import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import TrekForm from '../components/TrekForm';
import { toast } from 'react-toastify';

const EditTrekPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    location: '',
    difficulty: '',
    price: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(`/treks/${id}`);
        const t = res.data;
        setValues({
          name: t.name,
          location: t.location,
          difficulty: t.difficulty,
          price: String(t.price),
          images: t.images || [],
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load trek');
        navigate('/treks');
      } finally {
        setInitialLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

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
      await api.put(`/treks/${id}`, payload);
      toast.success('Trek updated');
      navigate('/treks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div>Loading trek...</div>;

  return (
    <TrekForm
      title="Edit Trek"
      values={values}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default EditTrekPage;
