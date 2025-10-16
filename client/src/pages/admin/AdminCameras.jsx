// pages/admin/AdminCameras.jsx
import React, { useState, useEffect } from "react";
import {
  getCameras,
  createCamera,
  updateCamera,
  deleteCamera,
} from "../../api";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359879/placeholder_logo_z6ko7r.png";

const AdminCameras = ({ setNotification, setActivePage }) => {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state matching your Camera model
  const [formData, setFormData] = useState({
    name: "",
    pricePerDay: "",
    offerPrice: "",
    description: "",
    image: "",
    inclusions: "",
    specs: "",
  });

  useEffect(() => {
    loadCameras();
    setActivePage("admin-cameras");
  }, [setActivePage]);

  const loadCameras = async () => {
    setLoading(true);
    try {
      const camerasData = await getCameras();
      setCameras(camerasData);
    } catch (error) {
      showNotification("Failed to load cameras", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      pricePerDay: "",
      offerPrice: "",
      description: "",
      image: "",
      inclusions: "",
      specs: "",
    });
    setEditingCamera(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Process arrays from comma-separated strings
      const cameraData = {
        name: formData.name,
        pricePerDay: Number(formData.pricePerDay),
        offerPrice: formData.offerPrice
          ? Number(formData.offerPrice)
          : undefined,
        description: formData.description,
        image: formData.image?.trim() || DEFAULT_IMAGE,
        inclusions: formData.inclusions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        specs: formData.specs
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        category: "camera",
      };

      if (editingCamera) {
        await updateCamera(editingCamera._id, cameraData);
        showNotification("Camera updated successfully!", "success");
      } else {
        await createCamera(cameraData);
        showNotification("Camera added successfully!", "success");
      }

      resetForm();
      loadCameras();
    } catch (error) {
      showNotification("Failed to save camera", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setFormData({
      name: camera.name,
      pricePerDay: camera.pricePerDay.toString(),
      offerPrice: camera.offerPrice?.toString() || "",
      description: camera.description || "",
      image: camera.image || "",
      inclusions: camera.inclusions?.join(", ") || "",
      specs: camera.specs?.join(", ") || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camera?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteCamera(id);
      showNotification("Camera deleted successfully!", "success");
      loadCameras();
    } catch (error) {
      showNotification("Failed to delete camera", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Header with Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="mr-3 sm:mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Manage Cameras
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                  Add, edit, or remove camera listings
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Camera
            </button>
          </div>
        </div>

        {/* Camera Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {editingCamera ? "Edit Camera" : "Add New Camera"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Camera Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                        placeholder="e.g., Canon EOS R5"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price Per Day (₹) *
                        </label>
                        <input
                          type="number"
                          name="pricePerDay"
                          value={formData.pricePerDay}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="5"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                          placeholder="e.g., 1500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Offer Price (₹)
                        </label>
                        <input
                          type="number"
                          name="offerPrice"
                          value={formData.offerPrice}
                          onChange={handleInputChange}
                          min="0"
                          step="5"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                          placeholder="e.g., 1000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                        placeholder="Describe the camera features and condition..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                        placeholder="https://example.com/camera-image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Inclusions (comma separated)
                      </label>
                      <input
                        type="text"
                        name="inclusions"
                        value={formData.inclusions}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                        placeholder="Battery, Charger, Lens Cap, Strap"
                      />
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Separate multiple items with commas
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Specifications (comma separated)
                      </label>
                      <textarea
                        name="specs"
                        value={formData.specs}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                        placeholder="45MP Full-Frame, 8K Video, 12fps Continuous, Dual Pixel AF"
                      />
                      <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Separate specifications with commas
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4 sm:pt-6 space-y-2 sm:space-y-0 space-y-reverse">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={formLoading}
                      className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {formLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Saving...
                        </>
                      ) : editingCamera ? (
                        "Update Camera"
                      ) : (
                        "Add Camera"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Cameras List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : cameras.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No cameras
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first camera.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Camera
                      </th>
                      <th
                        scope="col"
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                      <th scope="col" className="relative px-4 lg:px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cameras.map((camera) => (
                      <tr key={camera._id}>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12">
                              {camera.image ? (
                                <img
                                  className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-cover"
                                  src={camera.image}
                                  alt={camera.name}
                                />
                              ) : (
                                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg
                                    className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-3 lg:ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {camera.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {camera.specs && camera.specs[0]}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{camera.pricePerDay}/day
                          </div>
                          {camera.offerPrice && (
                            <div className="text-sm text-red-600 line-through">
                              ₹{camera.offerPrice}/day
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {camera.description}
                          </div>
                          {camera.inclusions &&
                            camera.inclusions.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Includes:{" "}
                                {camera.inclusions.slice(0, 2).join(", ")}
                                {camera.inclusions.length > 2 &&
                                  ` +${camera.inclusions.length - 2} more`}
                              </div>
                            )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(camera)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(camera._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-gray-200">
                {cameras.map((camera) => (
                  <div key={camera._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          {camera.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={camera.image}
                              alt={camera.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {camera.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ₹{camera.pricePerDay}/day
                            {camera.offerPrice && (
                              <span className="text-red-600 line-through ml-2">
                                ₹{camera.offerPrice}/day
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(camera)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(camera._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {camera.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {camera.description}
                      </p>
                    )}
                    {camera.inclusions && camera.inclusions.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Includes: {camera.inclusions.slice(0, 3).join(", ")}
                        {camera.inclusions.length > 3 &&
                          ` +${camera.inclusions.length - 3} more`}
                      </p>
                    )}
                    {camera.specs && camera.specs.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Specs: {camera.specs.slice(0, 2).join(", ")}
                        {camera.specs.length > 2 &&
                          ` +${camera.specs.length - 2} more`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCameras;
