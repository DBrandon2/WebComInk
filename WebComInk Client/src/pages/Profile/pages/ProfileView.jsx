import React from "react";
import { Edit, MapPin, Briefcase, Building } from "lucide-react";

export default function ProfileView({ data, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {data.firstName} {data.lastName}
          </h1>
          <p className="text-gray-500">@{data.username}</p>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          <Edit size={16} className="mr-1.5" /> Edit Profile
        </button>
      </div>

      {data.bio && (
        <div className="text-gray-700 leading-relaxed">{data.bio}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.jobTitle && data.company && (
          <div className="flex items-center text-gray-700">
            <div className="mr-2 text-gray-400">
              <Briefcase size={18} />
            </div>
            <span>
              {data.jobTitle} at <strong>{data.company}</strong>
            </span>
          </div>
        )}

        {data.location && (
          <div className="flex items-center text-gray-700">
            <div className="mr-2 text-gray-400">
              <MapPin size={18} />
            </div>
            <span>{data.location}</span>
          </div>
        )}

        {data.company && (
          <div className="flex items-center text-gray-700">
            <div className="mr-2 text-gray-400">
              <Building size={18} />
            </div>
            <span>{data.company}</span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Contact</h2>
        <p className="text-gray-700 cursor-pointer hover:text-indigo-600">
          {data.email}
        </p>
      </div>
    </div>
  );
}
