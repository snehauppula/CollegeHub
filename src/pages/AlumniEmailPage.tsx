import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Linkedin, Search, ExternalLink, PlusCircle, Loader2, Calendar, Briefcase } from "lucide-react";

interface AlumniProfile {
  _id?: string;
  name: string;
  email: string;
  linkedin?: string;
  company?: string;
  jobRole?: string;
  graduationYear?: number;
  createdAt?: string;
}

const AlumniLinkedInPage: React.FC = () => {
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAlumni, setNewAlumni] = useState<AlumniProfile>({
    name: "",
    email: "",
    linkedin: "",
    company: "",
    jobRole: "",
    graduationYear: undefined,
  });

  // ✅ Fetch Alumni List
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/alumni");
      // ✅ Sort by Graduation Year (latest first)
      const sortedData = data.sort(
        (a: AlumniProfile, b: AlumniProfile) => (b.graduationYear || 0) - (a.graduationYear || 0)
      );
      setAlumniList(sortedData);
    } catch (err) {
      console.error("Error fetching alumni:", err);
      alert("Failed to fetch alumni list!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlumni({ ...newAlumni, [e.target.name]: e.target.value });
  };

  // ✅ Submit New Alumni
  const handleAddAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumni.name || !newAlumni.email || !newAlumni.graduationYear) {
      return alert("Name, email, and graduation year are required!");
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/alumni", newAlumni);
      setAlumniList([data, ...alumniList]);
      setNewAlumni({
        name: "",
        email: "",
        linkedin: "",
        company: "",
        jobRole: "",
        graduationYear: undefined,
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding alumni:", err);
      alert("Failed to add alumni!");
    }
  };

  // ✅ Filter Alumni by Search (includes job role)
  const filteredAlumni = alumniList.filter(
    (alumni) =>
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumni.company && alumni.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.jobRole && alumni.jobRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumni.graduationYear &&
        alumni.graduationYear.toString().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout title="Alumni LinkedIn Network">
      <div className="py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Alumni Network</h1>
            <p className="text-gray-300">Connect and grow your professional network</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition-all duration-300"
          >
            <PlusCircle className="h-5 w-5" />
            {showForm ? "Close Form" : "Add Alumni"}
          </button>
        </div>

        {/* Add Alumni Form */}
        {showForm && (
          <form
            onSubmit={handleAddAlumni}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl mb-6 border border-white/20 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={newAlumni.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={newAlumni.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={newAlumni.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={newAlumni.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Job Role</label>
                <input
                  type="text"
                  name="jobRole"
                  placeholder="e.g. Software Engineer"
                  value={newAlumni.jobRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400"
                />
              </div>

              {/* Graduation Year */}
              <div>
                <label className="block text-gray-200 mb-1 font-medium">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  placeholder="e.g. 2025"
                  value={newAlumni.graduationYear || ""}
                  onChange={handleInputChange}
                  required
                  min="1980"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                Save Alumni
              </button>
            </div>
          </form>
        )}

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search alumni by name, email, company, job role, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
          />
        </div>

        {/* Alumni List */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
          </div>
        ) : filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <div
                key={alumni._id}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-300/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {alumni.name}
                  </h3>
                  {alumni.graduationYear && (
                    <div className="flex items-center gap-1 text-sm text-green-400 font-medium">
                      <Calendar className="h-4 w-4" />
                      {alumni.graduationYear}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-300">{alumni.email}</p>
                {alumni.company && (
                  <p className="text-blue-300 text-sm">{alumni.company}</p>
                )}
                {alumni.jobRole && (
                  <p className="text-gray-200 text-sm flex items-center gap-1 mt-1">
                    <Briefcase className="h-4 w-4 text-yellow-400" />
                    {alumni.jobRole}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  {alumni.linkedin && (
                    <a
                      href={alumni.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">No alumni found.</p>
        )}
      </div>
    </Layout>
  );
};

export default AlumniLinkedInPage;