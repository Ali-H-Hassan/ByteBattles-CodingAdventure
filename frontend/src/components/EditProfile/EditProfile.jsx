import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./EditProfile.css";
import Avatar from "../../assets/Profile (1).png";
import { updateProfile } from "../../actions/authActions";

const countries = ["United States", "United Kingdom", "Canada"];
const cities = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Leeds"],
  Canada: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton"],
};

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    contactNumber: "",
    country: "",
    city: "",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(Avatar);
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address || "",
        contactNumber: user.contactNumber || "",
        country: user.country || "",
        city: user.city || "",
        password: "",
      });
      if (user.profilePictureUrl) {
        setProfilePicture(user.profilePictureUrl);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));

    if (name === "country") {
      setProfile((prevProfile) => ({ ...prevProfile, city: "" }));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const file = fileInputRef.current.files[0];
    if (file) {
      formData.append("profilePicture", file);
    }

    dispatch(updateProfile(formData, authToken));
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };
  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="Name">Full Name</label>
          <input
            type="text"
            id="Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Username</label>
          <input
            type="text"
            id="Username"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={profile.contactNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={profile.country}
            onChange={handleChange}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={profile.city}
            onChange={handleChange}
            disabled={!profile.country}
          >
            <option value="">Select a city</option>
            {profile.country && cities[profile.country]
              ? cities[profile.country].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))
              : null}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </form>
      <div className="profile-image-container">
        <img src={Avatar} alt="Profile" className="profile-image" />
        <label htmlFor="profilePicture" className="edit-image-button">
          Edit Image
        </label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          ref={fileInputRef}
          onChange={handleProfilePictureChange}
          hidden
        />
      </div>
    </div>
  );
};

export default EditProfile;
