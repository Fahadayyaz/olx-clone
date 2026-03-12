import React from "react";

const cities = [
  "Pakistan",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Sheikhupura",
  "Mirpur Khas",
  "Rahim Yar Khan",
  "Mardan",
  "Abbottabad",
  "Dera Ghazi Khan",
  "Sahiwal",
];

export default function LocationModal({ onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Choose your location</h3>
        <div className="city-list">
          {cities.map((c) => (
            <button key={c} onClick={() => onSelect(c)}>
              📍 {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
