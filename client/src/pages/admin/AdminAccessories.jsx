// pages/admin/AdminAccessories.jsx
import React, { useState, useEffect } from "react";
import {
  getAccessories,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from "../../api";
import { useNavigate } from "react-router-dom";

const AdminAccessories = ({ setNotification, setActivePage }) => {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state matching your Accessory model
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
    loadAccessories();
    setActivePage("admin-accessories");
  }, [setActivePage]);

  const loadAccessories = async () => {
    setLoading(true);
    try {
      const accessoriesData = await getAccessories();
      setAccessories(accessoriesData);
    } catch (error) {
      showNotification("Failed to load accessories", error);
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
    setEditingAccessory(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Process arrays from comma-separated strings
      const accessoryData = {
        name: formData.name,
        pricePerDay: Number(formData.pricePerDay),
        offerPrice: formData.offerPrice
          ? Number(formData.offerPrice)
          : undefined,
        description: formData.description,
        image: formData.image,
        inclusions: formData.inclusions
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        specs: formData.specs
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        category: "accessory",
      };

      if (editingAccessory) {
        await updateAccessory(editingAccessory._id, accessoryData);
        showNotification("Accessory updated successfully!", "success");
      } else {
        await createAccessory(accessoryData);
        showNotification("Accessory added successfully!", "success");
      }

      resetForm();
      loadAccessories();
    } catch (error) {
      showNotification("Failed to save accessory", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      pricePerDay: accessory.pricePerDay.toString(),
      offerPrice: accessory.offerPrice?.toString() || "",
      description: accessory.description || "",
      image: accessory.image || "",
      inclusions: accessory.inclusions?.join(", ") || "",
      specs: accessory.specs?.join(", ") || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accessory?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccessory(id);
      showNotification("Accessory deleted successfully!", "success");
      loadAccessories();
    } catch (error) {
      showNotification("Failed to delete accessory", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Accessories
                </h1>
                <p className="mt-2 text-gray-600">
                  Add, edit, or remove accessory listings
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Add Accessory
            </button>
          </div>
        </div>

        {/* Accessory Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingAccessory ? "Edit Accessory" : "Add New Accessory"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Accessory Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="e.g., Camera Tripod"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          step="10"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
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
                          step="10"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Describe the accessory features and condition..."
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="https://example.com/accessory-image.jpg"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Case, Strap, Cleaning Kit"
                      />
                      <p className="mt-1 text-sm text-gray-500">
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Aluminum construction, Max height 60 inches, Weight 2.5 lbs"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Separate specifications with commas
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={formLoading}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
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
                      ) : editingAccessory ? (
                        "Update Accessory"
                      ) : (
                        "Add Accessory"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Accessories List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : accessories.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No accessories
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first accessory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Accessory
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accessories.map((accessory) => (
                    <tr key={accessory._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {accessory.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={accessory.image}
                                alt={accessory.name}
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
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {accessory.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {accessory.specs && accessory.specs[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-m font-medium text-gray-900">
                          ₹{accessory.pricePerDay}/day
                        </div>
                        {accessory.offerPrice && (
                          <div className="text-sm text-red-600 line-through">
                            ₹{accessory.offerPrice}/day
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {accessory.description}
                        </div>
                        {accessory.inclusions &&
                          accessory.inclusions.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Includes:{" "}
                              {accessory.inclusions.slice(0, 2).join(", ")}
                              {accessory.inclusions.length > 2 &&
                                ` +₹{accessory.inclusions.length - 2} more`}
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(accessory)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(accessory._id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccessories;
