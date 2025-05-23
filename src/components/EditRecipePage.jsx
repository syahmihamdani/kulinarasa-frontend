import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, ArrowLeft, X } from 'lucide-react';
import Navbar from './elements/Navbar';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState({
        id: '',
        name: '',
        caption: '',
        food_type: '',
        ingredients: '',
        procedure: '',
        is_public: true,
        image_url: ''
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const foodTypes = ['dessert', 'main course', 'appetizer', 'beverage'];


    // Fetch recipe data
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://kulinarasa-backend.vercel.app/recipe/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }
                const data = await response.json();
                const recipeData = data.success && data.payload ? data.payload : data;

                setRecipe({
                    id: recipeData.id || id,
                    name: recipeData.name || '',
                    caption: recipeData.caption || '',
                    food_type: recipeData.food_type || '',
                    ingredients: recipeData.ingredients || '',
                    procedure: recipeData.procedure || '',
                    is_public: recipeData.is_public !== false,
                    image_url: recipeData.image_url || ''
                });

                setImagePreview(recipeData.image_url || '');
            } catch (err) {
                setError('Failed to load recipe data');
                console.error('Error fetching recipe:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Update recipe text
    const handleSaveText = async () => {
        try {
            setSaving(true);
            setError('');

            const response = await fetch('https://kulinarasa-backend.vercel.app/recipe/update/text', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipe),
            });

            if (!response.ok) {
                throw new Error('Failed to update recipe');
            }

            const data = await response.json();
            if (data.success) {
                setSuccessMessage('Recipe updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error(data.message || 'Failed to update recipe');
            }
        } catch (err) {
            setError(err.message || 'Failed to update recipe');
        } finally {
            setSaving(false);
        }
    };

    // Update recipe image
    const handleUpdateImage = async () => {
        if (!selectedImage) return;

        try {
            setUploadingImage(true);
            setError('');

            const formData = new FormData();
            formData.append('id', recipe.id);
            formData.append('image', selectedImage);

            const response = await fetch('https://kulinarasa-backend.vercel.app/recipe/update/image', {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update image');
            }

            const data = await response.json();
            if (data.success) {
                setRecipe(prev => ({ ...prev, image_url: data.payload.image_url }));
                setSuccessMessage('Image updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
                setSelectedImage(null);
            } else {
                throw new Error(data.message || 'Failed to update image');
            }
        } catch (err) {
            setError(err.message || 'Failed to update image');
        } finally {
            setUploadingImage(false);
        }
    };

    // Clear image selection
    const clearImageSelection = () => {
        setSelectedImage(null);
        setImagePreview(recipe.image_url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="flex justify-center items-center py-12">
                        <p className="text-xl text-gray-600">Loading recipe...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 p-2 text-white hover:text-gray-800 hover:bg-gray-100 rounded-full"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-kulinarasa-darkblue font-kulinarasa">Edit Recipe</h1>
                    </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-600">{successMessage}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    {/* Image Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-kulinarasa-darkblue">Recipe Image</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Recipe preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <p className="text-gray-500">No image selected</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select New Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    {selectedImage && (
                                        <>
                                            <button
                                                onClick={handleUpdateImage}
                                                disabled={uploadingImage}
                                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                                            >
                                                <Upload size={16} className="mr-2" />
                                                {uploadingImage ? 'Uploading...' : 'Update Image'}
                                            </button>
                                            <button
                                                onClick={clearImageSelection}
                                                className="p-2 text-white hover:text-gray-700 border border-gray-300 rounded-lg"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recipe Form */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={recipe.name}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kulinarasa-darkblue focus:border-transparent"
                                placeholder="Enter recipe name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Caption
                            </label>
                            <textarea
                                name="caption"
                                value={recipe.caption}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-gray-50 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kulinarasa-darkblue focus:border-transparent resize-vertical"
                                placeholder="Brief description of your recipe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Food Type
                            </label>
                            <select
                                name="food_type"
                                value={recipe.food_type}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kulinarasa-darkblue focus:border-transparent"
                            >
                                {foodTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ingredients *
                            </label>
                            <textarea
                                name="ingredients"
                                value={recipe.ingredients}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full bg-gray-50 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kulinarasa-darkblue focus:border-transparent resize-vertical"
                                placeholder="List all ingredients (one per line or separated by commas)"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Procedure *
                            </label>
                            <textarea
                                name="procedure"
                                value={recipe.procedure}
                                onChange={handleInputChange}
                                rows={8}
                                className="w-full bg-gray-50 text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kulinarasa-darkblue focus:border-transparent resize-vertical"
                                placeholder="Step-by-step cooking instructions"
                                required
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_public"
                                id="is_public"
                                checked={recipe.is_public}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-black text-kulinarasa-darkblue bg-gray-100 border-gray-300 rounded focus:ring-kulinarasa-darkblue focus:ring-2"
                            />
                            <label htmlFor="is_public" className="ml-2 text-sm font-medium text-gray-700">
                                Make this recipe public
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveText}
                            disabled={saving || !recipe.name || !recipe.ingredients || !recipe.procedure}
                            className="px-6 py-2 bg-kulinarasa-darkblue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                            <Save size={16} className="mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRecipe;