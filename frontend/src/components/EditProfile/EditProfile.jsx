import React, { useState } from "react";
import "./EditProfile.css";
import Avatar from "../../assets/Profile (1).png";

const countries = ["United States", "United Kingdom", "Canada"];

const cities = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Leeds"],
  Canada: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton"],
};

function EditProfile() {
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

  const [profilePicture, setProfilePicture] = useState(Avatar);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(profile);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    window.location.href = "/dashboard";
  };
  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Full Name</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={profile.name}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Username</label>
          <input
            type="text"
            id="Username"
            name="Username"
            value={profile.username}
            onChange={handleChange}
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
            {profile.country &&
              cities[profile.country].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
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
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          onChange={handleProfilePictureChange}
          hidden
        />
        <button htmlFor="profilePicture" className="edit-image-button">
          Edit Image
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
