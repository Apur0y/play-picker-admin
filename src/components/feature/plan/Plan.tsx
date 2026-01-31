"use client"

import { useState } from "react";
import {  LuLoader } from "react-icons/lu";
import { toast } from "sonner";
import { 
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation
} from "../../../redux/api/plan/planSlice";

const PackagesManager = () => {
  const { data: allPackages, refetch, isLoading: loadingPackages } = useGetAllPackagesQuery({});
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [formState, setFormState] = useState({
    id: "",
    planName: "",
    description: "",
    amount: "",
    features: [""],
  });
  const [errors, setErrors] = useState({ planName: "", amount: "" });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === "features" && typeof index === "number") {
      const newFeatures = [...formState.features];
      newFeatures[index] = value;
      setFormState({ ...formState, features: newFeatures });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleAddFeature = () => setFormState({ ...formState, features: [...formState.features, ""] });
  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...formState.features];
    newFeatures.splice(index, 1);
    setFormState({ ...formState, features: newFeatures });
  };

  // Handle Create / Update
  const handleSubmit = async () => {
    const newErrors = { planName: "", amount: "" };
    if (!formState.planName.trim()) newErrors.planName = "Package name is required.";
    if (Number(formState.amount) < 1) newErrors.amount = "Amount must be at least $1";

    if (newErrors.planName || newErrors.amount) {
      setErrors(newErrors);
      return;
    }

    setErrors({ planName: "", amount: "" });
    setLoading(true);

    const payload = {
      planName: formState.planName,
      description: formState.description,
      amount: Number(formState.amount),
      features: formState.features.filter(f => f.trim() !== ""),
    };

    try {
      if (formState.id) {
        // Update existing
        await updatePackage({ id: formState.id, body: payload }).unwrap();
        toast.success("Package updated successfully!");
      } else {
        // Create new
        await createPackage(payload).unwrap();
        toast.success("Package created successfully!");
      }

      // Reset form
      setFormState({ id: "", planName: "", description: "", amount: "", features: [""] });
      refetch();
    } catch (err) {
      toast.error("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  // Edit a package
  const handleEdit = (pkg: any) => {
    setFormState({
      id: pkg._id,
      planName: pkg.planName,
      description: pkg.description,
      amount: pkg.amount.toString(),
      features: pkg.features.length ? pkg.features : [""],
    });
  };

  // Delete a package
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await deletePackage(id).unwrap();
      toast.success("Package deleted!");
      refetch();
    } catch {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="max-w-[1114px] mx-3 xl:mx-auto p-6 bg-gray-50 min-h-screen mt-[73px] space-y-6">
      
      {/* Packages List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Packages</h2>
        {loadingPackages ? (
          <div className="flex justify-center py-8">
            <LuLoader className="animate-spin w-8 h-8 text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {allPackages?.data.map((pkg: any) => (
              <div key={pkg._id} className="flex justify-between items-center border p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{pkg.planName} - ${pkg.amount}</p>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pkg.features.map((f: string, i: number) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Update Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {formState.id ? "Update Package" : "Create New Package"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input
              type="text"
              name="planName"
              value={formState.planName}
              onChange={handleChange}
              placeholder="Enter package name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.planName && <p className="text-red-600 text-sm mt-1">{errors.planName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Enter package description"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="amount"
              value={formState.amount}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            {formState.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  name="features"
                  value={f}
                  onChange={(e) => handleChange(e, i)}
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formState.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddFeature}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              Add Feature
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary cursor-pointer text-white py-3 rounded-md hover:bg-sky-700 transition-colors flex justify-center items-center"
          >
            {loading ? <LuLoader className="animate-spin w-6 h-6" /> : formState.id ? "Update Package" : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagesManager;
