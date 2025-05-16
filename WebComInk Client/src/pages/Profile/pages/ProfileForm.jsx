import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Save, X } from "lucide-react";

export default function ProfileForm({ data, onCancel, onSubmit }) {
  const profileSchema = yup.object().shape({
    firstName: yup.string().required("Requis"),
    lastName: yup.string().required("Requis"),
    email: yup.string().email("Entrez un email valide").required("Requis"),
    username: yup
      .string()
      .required("Requis")
      .min(3, "3 carcatères")
      .max(20, "20 caractères")
      .matches(/^[a-zA-Z0-9_]+$/, "A respecter"),
    bio: yup.string().max(200, "Bio doit faire moins de 200 caratères"),
    jobTitle: yup.string(),
    company: yup.string(),
    location: yup.string(),
    website: yup.string().url("Entrez une URL valide").nullable(),
    avatarUrl: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Prénom*
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className={`mt-1 block w-full px-3 py-2 bg-white border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Nom*
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className={`mt-1 block w-full px-3 py-2 bg-white border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email*
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`mt-1 block w-full px-3 py-2 bg-white border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Pseudo*
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            @
          </span>
          <input
            id="username"
            type="text"
            {...register("username")}
            className={`flex-1 block w-full px-3 py-2 bg-white border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            rows={3}
            {...register("bio")}
            className={`block w-full px-3 py-2 bg-white border ${
              errors.bio ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Une brêve description vous concernant. Maximum 200 caractères.
          </p>
          {errors.bio && (
            <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Métier
          </label>
          <input
            id="jobTitle"
            type="text"
            {...register("jobTitle")}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Entreprise
          </label>
          <input
            id="company"
            type="text"
            {...register("company")}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Lieu
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          <X size={16} className="mr-2" /> Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          <Save size={16} className="mr-2" /> Save Profile
        </button>
      </div>
    </form>
  );
}
