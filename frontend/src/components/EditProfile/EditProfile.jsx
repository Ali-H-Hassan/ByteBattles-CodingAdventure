import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  GetCountries,
  GetState,
  GetCity,
  GetAllCities,
} from "react-country-state-city";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./EditProfile.css";
import Avatar from "../../assets/Profile (1).png";
import { updateProfile } from "../../redux/auth/authActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faUser,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const EditProfile = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    contactNumber: "",
    country: "",
    city: "",
  });
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(Avatar);
  const fileInputRef = useRef();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [originalProfile, setOriginalProfile] = useState(null);
  const [originalPhoneValue, setOriginalPhoneValue] = useState("");
  const [hasProfilePictureChanged, setHasProfilePictureChanged] = useState(false);

  // State for countries, states, and cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citiesApiFailed, setCitiesApiFailed] = useState(false);

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const countriesData = await GetCountries();
        setCountries(countriesData || []);
      } catch (error) {
        console.error("Error loading countries:", error);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountryId) {
        setLoadingStates(true);
        try {
          const statesData = await GetState(selectedCountryId);
          setStates(statesData || []);
        } catch (error) {
          console.error("Error loading states:", error);
          setStates([]);
        } finally {
          setLoadingStates(false);
        }
      } else {
        setStates([]);
      }
    };
    loadStates();
  }, [selectedCountryId]);

  // Load cities when state or country changes
  useEffect(() => {
    const loadCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      try {
        let citiesData = [];
        
        // Try to load cities based on state or country
        if (selectedStateId && selectedCountryId) {
          try {
            citiesData = await GetCity(selectedCountryId, selectedStateId);
            // Validate response is an array
            if (!Array.isArray(citiesData)) {
              console.warn("GetCity returned non-array response");
              citiesData = [];
            }
          } catch (cityError) {
            console.warn("Error loading cities by state, trying country:", cityError);
            // Fallback to country-level cities
            try {
              citiesData = await GetAllCities(selectedCountryId);
              if (!Array.isArray(citiesData)) {
                citiesData = [];
              }
            } catch (fallbackError) {
              console.warn("Error loading cities by country:", fallbackError);
              citiesData = [];
            }
          }
        } else if (selectedCountryId) {
          try {
            citiesData = await GetAllCities(selectedCountryId);
            // Validate response is an array
            if (!Array.isArray(citiesData)) {
              console.warn("GetAllCities returned non-array response");
              citiesData = [];
            }
          } catch (error) {
            console.warn("Error loading cities:", error);
            citiesData = [];
          }
        }
        
        setCities(citiesData || []);
        // Reset API failure flag if cities loaded successfully
        if (citiesData && citiesData.length > 0) {
          setCitiesApiFailed(false);
        }
      } catch (error) {
        // Handle any unexpected errors
        console.error("Unexpected error loading cities:", error);
        // Check if error is due to HTML response (common with CORS/proxy issues)
        if (error.message && error.message.includes("JSON")) {
          console.warn("Received non-JSON response, likely a network/proxy issue");
          setCitiesApiFailed(true);
        }
        setCities([]);
        // If API fails, allow manual input
        setCitiesApiFailed(true);
      } finally {
        setLoadingCities(false);
      }
    };
    
    loadCities();
  }, [selectedCountryId, selectedStateId]);

  // Initialize user data
  useEffect(() => {
    if (user) {
      const initialProfile = {
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        contactNumber: user.contactNumber || "",
        country: user.country || "",
        city: user.city || "",
      };
      
      setProfile(initialProfile);
      setOriginalProfile(initialProfile);

      // Set phone value if contact number exists
      const initialPhone = user.contactNumber || "";
      setPhoneValue(initialPhone);
      setOriginalPhoneValue(initialPhone);
      setHasProfilePictureChanged(false);

      // Find country ID from country name
      if (user.country && countries.length > 0) {
        const countryData = countries.find((c) => c.name === user.country);
        if (countryData) {
          setSelectedCountryId(countryData.id);
        }
      }

      // Handle profile picture URL
      if (user.profilePictureUrl) {
        const apiBaseUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5057";
        let imageUrl = user.profilePictureUrl;

        if (imageUrl.startsWith("http")) {
          setProfilePicture(imageUrl);
        } else if (imageUrl.startsWith("/")) {
          setProfilePicture(`${apiBaseUrl}${imageUrl}`);
        } else {
          setProfilePicture(`${apiBaseUrl}/${imageUrl}`);
        }
      } else {
        setProfilePicture(Avatar);
      }
    }
  }, [user, countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleCountryChange = async (e) => {
    const countryId = parseInt(e.target.value);
    setSelectedCountryId(countryId);
    setSelectedStateId(null);
    setProfile((prev) => ({
      ...prev,
      city: "",
    }));
    // Reset API failure flag when country changes
    setCitiesApiFailed(false);

    if (countryId) {
      const countryData = countries.find((c) => c.id === countryId);
      if (countryData) {
        setProfile((prev) => ({
          ...prev,
          country: countryData.name,
        }));
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        country: "",
      }));
    }
  };

  const handleStateChange = (e) => {
    const stateId = parseInt(e.target.value);
    setSelectedStateId(stateId);
    setProfile((prev) => ({
      ...prev,
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setProfile((prev) => ({ ...prev, city: cityName }));
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value || "");
    if (value && !isValidPhoneNumber(value)) {
      setPhoneError("Please enter a valid phone number");
      setFieldErrors((prev) => ({ ...prev, contactNumber: "Invalid phone number format" }));
    } else {
      setPhoneError("");
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contactNumber;
        return newErrors;
      });
    }
    setProfile((prev) => ({
      ...prev,
      contactNumber: value || "",
    }));
  };

  const validateEmail = (email) => {
    if (!email) return null; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    if (!username) return null; // Username is optional
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setHasProfilePictureChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if there are any changes
  const hasChanges = () => {
    if (!originalProfile) return false;

    // Normalize values for comparison (treat undefined/null as empty string)
    const normalize = (val) => (val || "").trim();

    // Check profile fields
    const profileChanged = 
      normalize(profile.name) !== normalize(originalProfile.name) ||
      normalize(profile.username) !== normalize(originalProfile.username) ||
      normalize(profile.email) !== normalize(originalProfile.email) ||
      normalize(profile.address) !== normalize(originalProfile.address) ||
      normalize(profile.country) !== normalize(originalProfile.country) ||
      normalize(profile.city) !== normalize(originalProfile.city);

    // Check phone number (normalize both to empty string if falsy)
    const normalizedPhone = (phoneValue || "").trim();
    const normalizedOriginalPhone = (originalPhoneValue || "").trim();
    const phoneChanged = normalizedPhone !== normalizedOriginalPhone;

    // Check profile picture
    const pictureChanged = hasProfilePictureChanged;

    return profileChanged || phoneChanged || pictureChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors and success messages
    setSubmitError("");
    setSubmitSuccess("");
    setFieldErrors({});
    setIsSubmitting(true);

    // Validate fields
    const errors = {};

    // Validate email if provided
    if (profile.email && !validateEmail(profile.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate username if provided
    if (profile.username) {
      const usernameError = validateUsername(profile.username);
      if (usernameError) {
        errors.username = usernameError;
      }
    }

    // Validate phone number if provided
    if (phoneValue && !isValidPhoneNumber(phoneValue)) {
      errors.contactNumber = "Please enter a valid phone number";
      setPhoneError("Please enter a valid phone number");
    }

    // If there are validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = {};

      // Normalize function for comparison
      const normalize = (val) => (val || "").trim();
      
      // Only include fields that have changed
      const normalizedName = normalize(profile.name);
      const normalizedOriginalName = normalize(originalProfile?.name);
      if (normalizedName !== normalizedOriginalName) {
        formDataObj.name = normalizedName;
      }
      
      const normalizedUsername = normalize(profile.username);
      const normalizedOriginalUsername = normalize(originalProfile?.username);
      if (normalizedUsername !== normalizedOriginalUsername) {
        formDataObj.username = normalizedUsername;
      }
      
      const normalizedEmail = normalize(profile.email);
      const normalizedOriginalEmail = normalize(originalProfile?.email);
      if (normalizedEmail !== normalizedOriginalEmail) {
        formDataObj.email = normalizedEmail;
      }
      
      const normalizedAddress = normalize(profile.address);
      const normalizedOriginalAddress = normalize(originalProfile?.address);
      if (normalizedAddress !== normalizedOriginalAddress) {
        formDataObj.address = normalizedAddress;
      }
      
      const normalizedPhone = (phoneValue || "").trim();
      const normalizedOriginalPhone = (originalPhoneValue || "").trim();
      if (normalizedPhone !== normalizedOriginalPhone) {
        // Send the actual phoneValue (which might be in international format) or empty string
        formDataObj.contactNumber = phoneValue || "";
      }
      
      const normalizedCountry = normalize(profile.country);
      const normalizedOriginalCountry = normalize(originalProfile?.country);
      if (normalizedCountry !== normalizedOriginalCountry) {
        formDataObj.country = normalizedCountry;
      }
      
      const normalizedCity = normalize(profile.city);
      const normalizedOriginalCity = normalize(originalProfile?.city);
      if (normalizedCity !== normalizedOriginalCity) {
        formDataObj.city = normalizedCity;
      }

      const file = fileInputRef.current?.files?.[0];
      if (file && hasProfilePictureChanged) {
        formDataObj.profilePicture = file;
      }

      // Check if there's anything to update
      if (Object.keys(formDataObj).length === 0) {
        setSubmitError("No changes detected. Please make changes before saving.");
        setIsSubmitting(false);
        return;
      }

      // Debug: Log what we're sending
      console.log("Sending profile update:", formDataObj);

      const result = await dispatch(updateProfile(formDataObj));
      
      // Debug: Log the result
      console.log("Profile update result:", result);
      
      if (result && result.success) {
        setSubmitSuccess("Profile updated successfully!");
        
        // Update profile picture if changed
        if (result.user?.profilePictureUrl) {
          const apiBaseUrl =
            process.env.REACT_APP_API_URL || "http://localhost:5057";
          const imageUrl = result.user.profilePictureUrl.startsWith("http")
            ? result.user.profilePictureUrl
            : result.user.profilePictureUrl.startsWith("/")
            ? `${apiBaseUrl}${result.user.profilePictureUrl}`
            : `${apiBaseUrl}/${result.user.profilePictureUrl}`;
          setProfilePicture(imageUrl);
        }
        
        // Update local state and original profile
        if (result.user) {
          const updatedProfile = {
            name: result.user.name || "",
            username: result.user.username || "",
            email: result.user.email || "",
            address: result.user.address || "",
            contactNumber: result.user.contactNumber || "",
            country: result.user.country || "",
            city: result.user.city || "",
          };
          
          setProfile(updatedProfile);
          setOriginalProfile(updatedProfile);
          setOriginalPhoneValue(result.user.contactNumber || "");
          setHasProfilePictureChanged(false);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
        
        // Call onSuccess immediately to return to profile view, then clear success message
        if (onSuccess) {
          onSuccess();
        }
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess("");
        }, 3000);
      } else {
        const errorMsg = result?.error || "Failed to update profile. Please try again.";
        setSubmitError(errorMsg);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // If no onCancel callback, navigate to dashboard
      navigate("/dashboard");
    }
  };

  return (
    <div className="edit-profile-wrapper">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="edit-profile-form"
      >
        <div className="edit-profile-header">
          <div className="edit-profile-avatar-container">
            <div className="edit-profile-avatar-wrapper">
              <img
                src={profilePicture}
                alt="Profile"
                className="edit-profile-avatar"
              />
              <label
                htmlFor="profilePicture"
                className="edit-profile-avatar-overlay"
              >
                <FontAwesomeIcon icon={faCamera} />
              </label>
            </div>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              hidden
            />
            <p className="edit-profile-avatar-hint">Click to change photo</p>
          </div>
        </div>

        <div className="edit-profile-section">
          <h3 className="edit-profile-section-title">
            <FontAwesomeIcon icon={faUser} />
            Personal Information
          </h3>
          <div className="edit-profile-fields-grid">
            <div className="edit-profile-field">
              <label htmlFor="name" className="edit-profile-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="edit-profile-input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="edit-profile-field">
              <label htmlFor="username" className="edit-profile-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className={`edit-profile-input ${fieldErrors.username ? "edit-profile-input-error" : ""}`}
                placeholder="Enter username"
              />
              {fieldErrors.username && (
                <span className="edit-profile-error">{fieldErrors.username}</span>
              )}
            </div>

            <div className="edit-profile-field edit-profile-field-full">
              <label htmlFor="email" className="edit-profile-label">
                <FontAwesomeIcon icon={faEnvelope} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={`edit-profile-input ${fieldErrors.email ? "edit-profile-input-error" : ""}`}
                placeholder="your.email@example.com"
              />
              {fieldErrors.email && (
                <span className="edit-profile-error">{fieldErrors.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="edit-profile-section">
          <h3 className="edit-profile-section-title">
            <FontAwesomeIcon icon={faPhone} />
            Contact Information
          </h3>
          <div className="edit-profile-fields-grid">
            <div className="edit-profile-field edit-profile-field-full">
              <label htmlFor="phone" className="edit-profile-label">
                Phone Number
              </label>
              <div className="edit-profile-phone-wrapper">
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  className="edit-profile-phone-input"
                />
              </div>
              {phoneError && (
                <span className="edit-profile-error">{phoneError}</span>
              )}
            </div>

            <div className="edit-profile-field edit-profile-field-full">
              <label htmlFor="address" className="edit-profile-label">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="edit-profile-input"
                placeholder="Street address"
              />
            </div>
          </div>
        </div>

        <div className="edit-profile-section">
          <h3 className="edit-profile-section-title">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            Location
          </h3>
          <div className="edit-profile-fields-grid">
            <div className="edit-profile-field">
              <label htmlFor="country" className="edit-profile-label">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={selectedCountryId || ""}
                onChange={handleCountryChange}
                className="edit-profile-select"
                disabled={loadingCountries}
              >
                <option value="">
                  {loadingCountries ? "Loading..." : "Select Country"}
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {states.length > 0 && (
              <div className="edit-profile-field">
                <label htmlFor="state" className="edit-profile-label">
                  State/Province
                </label>
                <select
                  id="state"
                  value={selectedStateId || ""}
                  onChange={handleStateChange}
                  className="edit-profile-select"
                  disabled={loadingStates}
                >
                  <option value="">
                    {loadingStates ? "Loading..." : "Select State/Province"}
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="edit-profile-field">
              <label htmlFor="city" className="edit-profile-label">
                City
              </label>
              {citiesApiFailed || cities.length === 0 ? (
                // Fallback to text input if API failed or no cities available
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!selectedCountryId}
                  className="edit-profile-input"
                  placeholder={!selectedCountryId ? "Select country first" : "Enter city name"}
                />
              ) : (
                // Use dropdown if cities are available
                <select
                  id="city"
                  name="city"
                  value={profile.city}
                  onChange={handleCityChange}
                  disabled={!selectedCountryId || loadingCities}
                  className="edit-profile-select"
                >
                  <option value="">
                    {loadingCities
                      ? "Loading..."
                      : !selectedCountryId
                      ? "Select country first"
                      : "Select City"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {(submitError || submitSuccess) && (
          <div className={`edit-profile-message ${submitSuccess ? "edit-profile-message-success" : "edit-profile-message-error"}`}>
            {submitSuccess || submitError}
          </div>
        )}

        <div className="edit-profile-actions">
          <button
            type="button"
            className="edit-profile-cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="edit-profile-save-btn"
            disabled={isSubmitting || !hasChanges()}
            title={!hasChanges() ? "No changes to save" : ""}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
