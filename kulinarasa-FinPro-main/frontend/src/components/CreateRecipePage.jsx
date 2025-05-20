import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './elements/Navbar';

export default function CreateRecipePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState(['']);

  const [formData, setFormData] = useState({
    name: '',
    caption: '',
    author_id: '',
    food_type: 'main course',
    procedure: '',
    is_public: true,
    ingredients: ''
  });

  const foodTypes = ['dessert', 'main course', 'appetizer', 'beverage'];

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    console.log(user);

    setUserData(user);

    setFormData(prev => ({
      ...prev,
      author_id: user.id
    }));
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ingredients: ingredients
        .filter(item => item.name.trim())
        .map(item => `${item.quantity} ${item.unit} ${item.name}`.trim())
        .join('\n')
    }));
  }, [ingredients]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      procedure: steps.filter(step => step.trim()).join('\n')
    }));
  }, [steps]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const user = localStorage.getItem('user');
    if (!user) {
        setError('Please login first');
        navigate('/login');
        return;
    }

    try {
      // Validation
      if (!formData.name || !formData.caption || !formData.procedure || !formData.ingredients) {
        throw new Error('Please fill in all required fields');
      }

      if(!imageFile){
        throw new Error('Please insert recipe image')
      }

      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('caption', formData.caption);
      submissionData.append('author_id', formData.author_id);
      submissionData.append('food_type', formData.food_type);
      submissionData.append('procedure', formData.procedure);
      submissionData.append('ingredients', formData.ingredients);
      submissionData.append('is_public', formData.is_public);
      submissionData.append('image', imageFile);

      const response = await axios.post('http://localhost:3000/recipe/create', 
          submissionData, 
          {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': user
              }
          }
      );

      setSuccess('Recipe created successfully!');
      setTimeout(() => setSuccess(''), 2000);

      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
          setError('Please login first');
          navigate('/login');
      } else {
          setError(err.response?.data?.message || err.message || 'Failed to create recipe');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-5">
        <h1 className="text-3xl font-bold mb-6 text-center font-kulinarasa text-kulinarasa-orange">Create New Recipe</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Recipe Name */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Rendang'
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black"
                  required
                />
              </div>

              {/* Caption */}
              <div>
                <label htmlFor="caption" className="block text-gray-700 font-medium mb-2">
                  Caption *
                </label>
                <textarea
                  id="caption"
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  rows="2"
                  placeholder='Resep rendang yang lezat dan mudah dimasak...'
                  className="bg-white text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Food Type */}
              <div>
                <label htmlFor="food_type" className="block text-gray-700 font-medium mb-2">
                  Food Type *
                </label>
                <select
                  id="food_type"
                  name="food_type"
                  value={formData.food_type}
                  onChange={handleChange}
                  className="bg-white text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {foodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                  Recipe Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="h-48 object-cover rounded-md w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Ingredients Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Ingredients *</label>
                
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-11 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Name (e.g. Flour)"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                        className="bg-white text-black px-3 py-2 border rounded-md col-span-5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Qty"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                        className="bg-white text-black px-3 py-2 border rounded-md col-span-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                        className="bg-white text-black px-3 py-2 border rounded-md col-span-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm col-span-1"
                        disabled={ingredients.length === 1}
                      >
                        -
                      </button>
                    </div>
                  ))}
                </div>

                {/* Fixed Add Ingredient Button */}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-kulinarasa-orange hover:bg-kulinarasa-brown px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm mt-2"
                  >
                    + Add Ingredient
                  </button>
                </div>

                {/* Hidden input to store the formatted ingredients */}
                <input
                  type="hidden"
                  name="ingredients"
                  value={formData.ingredients}
                />
              </div>

              {/* Procedure Steps */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Cooking Steps *
                </label>

                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="px-3 py-2 bg-kulinarasa-orange/40 text-white rounded text-sm font-medium min-w-8 text-center">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder="Describe this cooking step"
                        className="bg-white text-black flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          disabled={steps.length === 1}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={addStep}
                    className="mt-2 px-4 py-2 bg-kulinarasa-orange hover:bg-kulinarasa-brown text-white rounded hover:bg-green-600 text-sm"
                  >
                    + Add Steps
                  </button>
                </div>

                {/* Hidden input to store the formatted procedure */}
                <input
                  type="hidden"
                  name="procedure"
                  value={formData.procedure}
                />
              </div>
            </div>
          </div>

          {/* Visibility Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-gray-700">
              Make this recipe public (visible to everyone)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-kulinarasa-orange hover:bg-kulinarasa-brown text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-orange-300 font-medium"
            >
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}