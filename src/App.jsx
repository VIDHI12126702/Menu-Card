
import React, { useState, useEffect } from "react";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // OWNER LOGIN
  const toggleAdmin = () => {
    const pass = prompt("Enter Owner Password");

    if (pass === "atithi123") {
      setIsAdmin(true);
      alert("Owner Login Successful");
    } else {
      alert("Wrong Password");
    }
  };

  // OWNER LOGOUT / BACK TO MAIN PAGE
  const logoutAdmin = () => {
    const confirmLogout = window.confirm(
      "Do you want to go back to customer view?"
    );

    if (!confirmLogout) return;

    setIsAdmin(false);

    alert("Returned To Main Page Successfully");
  };

  const defaultMenu = [
    {
      title: "ATITHI BREAKFAST COMBO",
      items: [
        { name: "Aloo Paratha + Masala Chai", price: "7.99" },
        { name: "Chole Bhature + Masala Chai", price: "11.99" },
        { name: "Masala Dosa + Filter Coffee", price: "11.99" },
      ],
    },

    {
      title: "NORTH INDIAN BREAKFAST",
      items: [
        { name: "Poori Bhaji", price: "9" },
        { name: "Chole Poori", price: "10" },
        { name: "Halwa Poori", price: "11" },
        { name: "Chole Bhature", price: "11" },
      ],
    },

    {
      title: "SOUTH INDIAN BREAKFAST",
      items: [
        { name: "Idli Sambar", price: "9" },
        { name: "Vada Sambar", price: "9" },
        { name: "Plain Dosa", price: "12" },
        { name: "Masala Dosa", price: "14" },
        { name: "Mysore Masala Dosa", price: "15" },
      ],
    },

    {
      title: "TANDOOR SPECIALITIES",
      items: [
        { name: "Paneer Tikka", price: "17" },
        { name: "Malai Tikka", price: "17" },
        { name: "Hariyali Tikka", price: "17" },
        { name: "Achari Tikka", price: "17" },
      ],
    },

    {
      title: "INDIAN STREET FOOD",
      items: [
        { name: "Pani Puri", price: "7" },
        { name: "Dahi Puri", price: "8" },
        { name: "Aloo Tikki Chaat", price: "8" },
        { name: "Dahi Papdi Chaat", price: "9" },
      ],
    },

    {
      title: "CURRIES - CHEF'S SELECTION",
      items: [
        { name: "Paneer Butter Masala", price: "18" },
        { name: "Paneer Makhani", price: "18" },
        { name: "Kadhai Paneer", price: "18" },
        { name: "Palak Paneer", price: "18" },
      ],
    },

    {
      title: "RICE",
      items: [
        { name: "Steamed Basmati Rice", price: "3" },
        { name: "Jeera Rice", price: "4" },
        { name: "Veg Dum Biryani", price: "17" },
      ],
    },

    {
      title: "BREADS",
      items: [
        { name: "Plain Naan", price: "4" },
        { name: "Butter Naan", price: "4.5" },
        { name: "Garlic Naan", price: "5" },
        { name: "Tandoori Roti", price: "4" },
      ],
    },

    {
      title: "DESSERTS",
      items: [
        { name: "Gulab Jamun", price: "4.99" },
        { name: "Rice Kheer", price: "5.49" },
        { name: "Royal Rose Falooda", price: "8.49" },
      ],
    },

    {
      title: "BEVERAGES",
      items: [
        { name: "Mango Mint Blast", price: "6.99" },
        { name: "Sweet Lassi", price: "4.99" },
        { name: "Cold Coffee", price: "6.99" },
      ],
    },
  ];

const [menuSections, setMenuSections] = useState(() => {
  const savedMenu = localStorage.getItem("restaurantMenu");

  return savedMenu
    ? JSON.parse(savedMenu)
    : defaultMenu;
});

// AUTO SAVE MENU
useEffect(() => {
  localStorage.setItem(
    "restaurantMenu",
    JSON.stringify(menuSections)
  );
}, [menuSections]);

// UPDATE ITEM
  const updateItem = (sectionIndex, itemIndex, field, value) => {
    const updated = [...menuSections];

    updated[sectionIndex].items[itemIndex][field] = value;

    setMenuSections(updated);
  };

  // ADD ITEM
  const addItem = (sectionIndex) => {
    const updated = [...menuSections];

    updated[sectionIndex].items.push({
      name: "New Item",
      price: "0",
    });

    setMenuSections(updated);

    alert("New Item Added Successfully");
  };

  // DELETE ITEM
  const deleteItem = (sectionIndex, itemIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    const updated = [...menuSections];

    updated[sectionIndex].items.splice(itemIndex, 1);

    setMenuSections(updated);

    alert("Item Deleted Successfully");
  };

  // UPDATE SECTION TITLE
  const updateSectionTitle = (sectionIndex, value) => {
    const updated = [...menuSections];

    updated[sectionIndex].title = value;

    setMenuSections(updated);
  };

  // ADD SECTION
  const addSection = () => {
    const sectionName = prompt("Enter New Section Name");

    if (!sectionName) return;

    const updated = [...menuSections];

    updated.push({
      title: sectionName,
      items: [],
    });

    setMenuSections(updated);

    alert("New Section Added Successfully");
  };

  // DELETE SECTION
  const deleteSection = (sectionIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this section?"
    );

    if (!confirmDelete) return;

    const updated = [...menuSections];

    updated.splice(sectionIndex, 1);

    setMenuSections(updated);

    alert("Section Deleted Successfully");
  };

  return (
    <div
      style={{
        background: "#efe7d3",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          background: "#f8f1e4",
          border: "4px solid #c19a49",
          padding: "25px",
        }}
      >
        {/* TOP BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {!isAdmin ? (
            <button
              onClick={toggleAdmin}
              style={{
                background: "#8b1e12",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Owner Login
            </button>
          ) : (
            <button
              onClick={logoutAdmin}
              style={{
                background: "#444",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back To Main Page
            </button>
          )}
        </div>

        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src="/Atithi Logo.png"
            alt="Atithi Logo"
            style={{
              width: "100%",
              maxWidth: "700px",
            }}
          />
        </div>

        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <h2
            style={{
              color: "#8b1e12",
              fontSize: "36px",
            }}
          >
            PURE VEG LUXURY DINING
          </h2>

          <p
            style={{
              color: "#6d4c22",
              fontSize: "18px",
              lineHeight: "1.8",
            }}
          >
            Where We Turn Moments Into Memories.
            <br />
            Authentic Indian Vegetarian Cuisine
          </p>
        </div>

        {/* ADD SECTION */}
        {isAdmin && (
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <button
              onClick={addSection}
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "12px 20px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              + Add New Section
            </button>
          </div>
        )}

        {/* MENU GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
          }}
        >
          {menuSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              style={{
                background: "#fffaf0",
                border: "2px solid #d9bf8b",
                padding: "20px",
              }}
            >
              {/* SECTION TITLE */}
              {isAdmin ? (
                <input
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(sectionIndex, e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "24px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                />
              ) : (
                <h2
                  style={{
                    color: "#7d5a1b",
                    textAlign: "center",
                    borderBottom: "2px solid #d9bf8b",
                    paddingBottom: "10px",
                    marginBottom: "20px",
                    fontSize: "28px",
                  }}
                >
                  {section.title}
                </h2>
              )}

              {/* DELETE SECTION */}
              {isAdmin && (
                <button
                  onClick={() => deleteSection(sectionIndex)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    marginBottom: "15px",
                    cursor: "pointer",
                  }}
                >
                  Delete Section
                </button>
              )}

              {/* ITEMS */}
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px dotted #c7ab73",
                    padding: "10px 0",
                    fontSize: "17px",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "60%" }}>
                    {isAdmin ? (
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            "name",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "5px",
                        }}
                      />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </div>

                  <div>
                    {isAdmin ? (
                      <input
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            "price",
                            e.target.value
                          )
                        }
                        style={{
                          width: "70px",
                          padding: "5px",
                        }}
                      />
                    ) : (
                      <strong>${item.price}</strong>
                    )}
                  </div>

                  {/* DELETE ITEM */}
                  {isAdmin && (
                    <button
                      onClick={() =>
                        deleteItem(sectionIndex, itemIndex)
                      }
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}

              {/* ADD ITEM */}
              {isAdmin && (
                <button
                  onClick={() => addItem(sectionIndex)}
                  style={{
                    marginTop: "15px",
                    background: "#7d5a1b",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  + Add Item
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "60px",
            borderTop: "3px solid #c19a49",
            paddingTop: "30px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#8b1e12",
              fontSize: "34px",
              marginBottom: "30px",
            }}
          >
            ATITHI PURE VEG CALGARY
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "40px",
              marginBottom: "25px",
              color: "#6d4c22",
              fontSize: "20px",
            }}
          >
            <div>📍 Calgary, Alberta, Canada</div>
            <div>📞 +1 (403) 475-4414</div>
            <div>📧 info@atithicalgary.com</div>
            <div>🌐 atithicalgary.com</div>
          </div>

          <div
            style={{
              color: "#8b1e12",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            ⭐ 100% Vegetarian • Fresh Ingredients • Swaminarayan Options Available
          </div>
        </div>
      </div>
    </div>
  );
}


