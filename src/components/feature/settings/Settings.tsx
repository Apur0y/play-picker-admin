"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../../../redux/api/auth/authApi";
import { useGetMeQuery, useGetSignedUrlQuery, useUpdatePasswordMutation } from "../../../redux/api/getMe/getMeApi";
import { toast } from "sonner";
import { CgEye } from "react-icons/cg";
import { IoEyeOffOutline } from "react-icons/io5";
import { MdCameraAlt } from "react-icons/md";
import { LuLoader } from "react-icons/lu";

const ProfileSettings = () => {

  const [view, setView] = useState(true);
  const [view2, setView2] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)


  const { data: userInfo } = useGetMeQuery({});


  const [formData, setFormData] = useState({
    firstName: userInfo?.data.name.split(' ')[0] || '',
    lastName: userInfo?.data.name.split(' ')[1] || '',
    name: userInfo?.data.name,
    email: userInfo?.data.email,
    phone: userInfo?.data.phone,
    dateOfBirth: userInfo?.data.dateOfBirth,
    address: userInfo?.data.address,
    gender: userInfo?.data.gender || "male",
    currentPassword: "",
    newPassword: "",
  });

  const [update] = useUpdateProfileMutation();
  const [updatePassword] = useUpdatePasswordMutation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Dynamically update name field by concatenating firstName and lastName
      if (name === "firstName" || name === "lastName") {
        const updatedFirstName = name === "firstName" ? value : prev.firstName;
        const updatedLastName = name === "lastName" ? value : prev.lastName;
        const updatedName = `${updatedFirstName} ${updatedLastName}`.trim(); // Concatenate firstName and lastName
        return { ...prev, [name]: value, name: updatedName };
      }
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (userInfo?.data) {
      setFormData({
        firstName: userInfo?.data.name.split(' ')[0] || '',
        lastName: userInfo?.data.name.split(' ').slice(1).join(' ') || '',
        name: userInfo?.data.name,
        email: userInfo?.data.email,
        phone: userInfo?.data.phone,
        dateOfBirth: userInfo?.data.dateOfBirth,
        address: userInfo?.data.address,
        gender: userInfo?.data.gender || "male",
        currentPassword: "",
        newPassword: "",
      })
    }
  }, [userInfo?.data])

  const handleProfileSubmit = async () => {
    const dob = new Date(formData?.dateOfBirth);
    const today = new Date();

    // 1. Check if DOB is in the future
    if (dob > today) {
      return toast.error("Date of birth cannot be in the future");
    }
    setLoading(true)
    try {
      const formattedDateOfBirth = formData.dateOfBirth
  ? new Date(formData.dateOfBirth).toISOString()
  : null;

// Dynamically build the payload
const payload:any = {};

if (formData.email) payload.email = formData.email;
if (formData.phone) payload.phone = formData.phone;
if (formattedDateOfBirth) payload.dateOfBirth = formattedDateOfBirth;
if (formData.address) payload.address = formData.address;
if (formData.gender) payload.gender = formData.gender;
if (formData.name) payload.name = formData.name;

      const res = await update(payload);

      if (res.data) {
        toast.success("Profile updated Successfully!");
        setLoading(false)
      }
    } catch (error) {
      toast.error("Profile updated Fail!")
      setLoading(false)
    }
    setLoading(false)

  };

  const handlePasswordSubmit = async () => {
    setLoading2(true)


    try {
      const res = await updatePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      if (res.data) {
        toast.success("Password Updated!");
        setLoading2(false)
      }
    } catch (error) {
      toast.error("Password Update Fail!")
      setLoading2(false)
    }
    setLoading2(false)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file);
      // Get mime type (e.g., "image/png")

    }
  };

  const fileType = selectedFile?.name.split('.').pop();
  const mimeType = selectedFile?.type;

  // Use the RTK Query hook to get the signed URL
  const { data: getRes } = useGetSignedUrlQuery({
    fileType: fileType || '',
    mimeType: mimeType || '',
  });

  const signedUrl = getRes?.data.signedUrl;



  useEffect(() => {
    if (signedUrl && selectedFile) {

      try {
        // Upload the file to S3 using the signed URL
        const uploadResponse: any = fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': mimeType || 'application/octet-stream',
          },
          body: selectedFile,
        });
        const publicUrl = signedUrl.split('?')[0];
        update({
          avatar: publicUrl
        })


        if (uploadResponse.ok) {

        } else {
          console.error('File upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
      }

    }
  }, [signedUrl])


  return (
    <div className="mx-5 md:mx-12 pt-[73px] max-w-[1114px] xl:mx-auto">
      {/* Profile Photo Section */}

      <div className="flex flex-col items-center  justify-center mb-8">


        <div className="relative  mb-5">
          <div className="w-31 h-31 rounded-full flex items-center justify-center overflow-hidden shadow-lg ">
            <img
              // src="/avatarPlaceholder.jpg"
              src={userInfo?.data.avatar || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"}
              alt="image"
              className="w-full h-full object-cover"

            />
            <label className="absolute bottom-3 -right-0 bg-primary  p-2 rounded-full shadow-md cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <MdCameraAlt className="text-white " />
            </label>
          </div>
        </div>
        <label className="mb-2 text-lg font-semibold text-primary cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          Change Photo
        </label>
        <p className="text-[16px] text-primary">Upload a new photo (max 5MB)</p>
      </div>


      <div className="bg-white p-8 rounded-xl">
        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent"
            />
          </div> */}

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent text-gray-500"
              disabled
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={
                  formData.dateOfBirth && !isNaN(new Date(formData.dateOfBirth).getTime())
                    ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                placeholder="yyyy / mm / dd"
                className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent text-gray-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {/* <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg> */}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent text-gray-500"
            />
          </div>

          {/* Gender */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent text-gray-500 appearance-none"
              >
                <option value="Select Gender">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button
            className="px-6 py-2 border cursor-pointer hover:bg-gray-100 transition border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:ring-offset-2"
            onClick={handleProfileSubmit}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-primary text-xs md:text-base text-white rounded-md hover:bg-primary/90 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:ring-offset-2"
            onClick={handleProfileSubmit}
          >
                {!loading ? "Save Change" : <LuLoader
            className="animate-spin text-center w-[75px] md:w-25 h-6"
          />}

            
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white mt-8 p-8 rounded-xl">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Security</h2>
        </div>

        <div className="grid gap-6 mb-6">
          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type={view ? "password" : "text"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent"
            />
            <button onClick={() => setView(!view)}>

              {view ? <IoEyeOffOutline className="absolute top-11 right-4" /> : <CgEye className="absolute top-11 right-4" />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type={view2 ? "password" : "text"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-6 py-[11px] bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:border-transparent"
            />
            <button onClick={() => setView2(!view2)}>

              {view2 ? <IoEyeOffOutline className="absolute top-11 right-4" /> : <CgEye className="absolute top-11 right-4" />}
            </button>          </div>
        </div>

        {/* Update Password Button */}
        <button
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-pribg-primary focus:ring-offset-2 cursor-pointer"
          onClick={handlePasswordSubmit}
        >
          {!loading2 ? "Update Password" : <LuLoader
            className="animate-spin text-center w-32 h-6"
          />}

        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
