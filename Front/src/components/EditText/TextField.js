import React, { useState } from "react";

function TextField() {
  const [description, setDescription] = useState("Description par défaut");

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Ajouter une description..."
      />
      <button className="whiteButton" onClick={() => console.log(description)}>
        Modifier la description
      </button>
    </div>
  );
}

export default TextField;
