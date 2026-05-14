import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import logo from "./assets/Atithi Logo.png";

export default function App() {
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isMobile = window.innerWidth < 768;

  // FETCH MENU
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("menu")
        .select("id,title,items")
        .order("id", { ascending: true });

      if (error) {
        console.log(error);
        alert(error.message);
      } else {
        setMenuSections(data || []);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  // OWNER LOGIN
  const ownerLogin = () => {
    const password = prompt("Enter Owner Password");

    if (password === "atithi123") {
      setIsAdmin(true);
      alert("Owner Login Successful");
    } else {
      alert("Wrong Password");
    }
  };

  // LOGOUT
  const logoutOwner = () => {
    setIsAdmin(false);
  };

  // ADD SECTION
  const addSection = async () => {
    const title = prompt("Enter Section Name");

    if (!title) return;

    const { error } = await supabase
      .from("menu")
      .insert([
        {
          title,
          items: [],
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      fetchMenu();
      alert("Section Added");
    }
  };

  // DELETE SECTION
  const deleteSection = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this section?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("menu")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      fetchMenu();
      alert("Section Deleted");
    }
  };

  // UPDATE TITLE
  const updateSectionTitle = (
    sectionIndex,
    value
  ) => {
    const updated = [...menuSections];

    updated[sectionIndex].title = value;

    setMenuSections(updated);
  };

  // UPDATE ITEM
  const updateItem = (
    sectionIndex,
    itemIndex,
    field,
    value
  ) => {
    const updated = [...menuSections];

    updated[sectionIndex].items[itemIndex][field] =
      value;

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
  };

  // DELETE ITEM
  const deleteItem = (
    sectionIndex,
    itemIndex
  ) => {
    const confirmDelete = window.confirm(
      "Delete this item?"
    );

    if (!confirmDelete) return;

    const updated = [...menuSections];

    updated[sectionIndex].items.splice(itemIndex, 1);

    setMenuSections(updated);
  };

  // SAVE SECTION
  const saveSection = async (section) => {
    const { error } = await supabase
      .from("menu")
      .update({
        title: section.title,
        items: section.items,
      })
      .eq("id", section.id);

    if (error) {
      alert(error.message);
      console.log(error);
    } else {
      fetchMenu();
      alert("Saved Successfully");
    }
  };

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#efe7d3",
          color: "#8b1e12",
          fontSize: "30px",
          fontFamily: "Georgia",
        }}
      >
        Loading Menu...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#efe7d3",
        minHeight: "100vh",
        padding: isMobile ? "10px" : "25px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          background: "#f8f1e4",
          border: "4px solid #c19a49",
          borderRadius: "20px",
          padding: isMobile ? "15px" : "30px",
          boxSizing: "border-box",
        }}
      >
        {/* TOP BUTTONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {!isAdmin ? (
            <button
              onClick={ownerLogin}
              style={{
                background: "#8b1e12",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Owner Login
            </button>
          ) : (
            <>
              <button
                onClick={addSection}
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                + Add Section
              </button>

              <button
                onClick={logoutOwner}
                style={{
                  background: "#444",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Customer View
              </button>
            </>
          )}
        </div>

        {/* TOP LOGO */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <img
            src={logo}
            alt="Atithi Logo"
            style={{
              width: isMobile ? "220px" : "340px",
              height: "auto",
              objectFit: "contain",
              marginBottom: "20px",
              filter:
                "drop-shadow(0 5px 10px rgba(0,0,0,0.2))",
            }}
          />
        </div>

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          

          <p
            style={{
              color: "#7d5a1b",
              fontSize: isMobile ? "18px" : "28px",
              fontStyle: "italic",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            “Serving Authentic Indian Flavors With
            Tradition, Purity & Love”
          </p>

          <p
            style={{
              color: "#8b1e12",
              fontSize: isMobile ? "14px" : "18px",
              maxWidth: "850px",
              margin: "0 auto",
              lineHeight: "1.8",
            }}
          >
            Experience the rich taste of handcrafted
            Indian cuisine made with fresh
            ingredients, traditional recipes, and
            pure vegetarian goodness in every bite.
          </p>
        </div>

        {/* MENU */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1fr 1fr",
            gap: "25px",
          }}
        >
          {menuSections.map(
            (section, sectionIndex) => (
              <div
                key={section.id}
                style={{
                  background: "#fffaf0",
                  border: "2px solid #d8b46b",
                  borderRadius: "15px",
                  padding: "20px",
                  height: "fit-content",
                  boxShadow:
                    "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                {/* SECTION TITLE */}
                {isAdmin ? (
                  <input
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(
                        sectionIndex,
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                ) : (
                  <h2
                    style={{
                      textAlign: "center",
                      color: "#7d5a1b",
                      fontSize: isMobile
                        ? "24px"
                        : "34px",
                      marginBottom: "20px",
                    }}
                  >
                    {section.title}
                  </h2>
                )}

                {/* ITEMS */}
                {section.items &&
                  section.items.map(
                    (item, itemIndex) => (
                      <div
                        key={itemIndex}
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 0",
                          borderBottom:
                            "1px dotted #d0b27c",
                          flexDirection: isMobile
                            ? "column"
                            : "row",
                        }}
                      >
                        {/* ITEM NAME */}
                        <div
                          style={{
                            width: isMobile
                              ? "100%"
                              : "70%",
                          }}
                        >
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
                                padding: "8px",
                                borderRadius: "6px",
                                border:
                                  "1px solid #ccc",
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                fontSize:
                                  isMobile
                                    ? "16px"
                                    : "18px",
                              }}
                            >
                              {item.name}
                            </span>
                          )}
                        </div>

                        {/* PRICE */}
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
                                width: "80px",
                                padding: "8px",
                                borderRadius: "6px",
                                border:
                                  "1px solid #ccc",
                              }}
                            />
                          ) : (
                            <strong
                              style={{
                                color: "#8b1e12",
                                fontSize:
                                  isMobile
                                    ? "16px"
                                    : "18px",
                              }}
                            >
                              ${item.price}
                            </strong>
                          )}
                        </div>

                        {/* DELETE ITEM */}
                        {isAdmin && (
                          <button
                            onClick={() =>
                              deleteItem(
                                sectionIndex,
                                itemIndex
                              )
                            }
                            style={{
                              background: "red",
                              color: "white",
                              border: "none",
                              padding:
                                "6px 10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            X
                          </button>
                        )}
                      </div>
                    )
                  )}

                {/* ADMIN BUTTONS */}
                {isAdmin && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        addItem(sectionIndex)
                      }
                      style={{
                        background: "#7d5a1b",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      + Add Item
                    </button>

                    <button
                      onClick={() =>
                        saveSection(section)
                      }
                      style={{
                        background: "green",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>

                    <button
                      onClick={() =>
                        deleteSection(
                          section.id
                        )
                      }
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete Section
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* MODERN FOOTER */}
        <div
          style={{
            marginTop: "50px",
            background: "#efe3c2",
            color: "#5c4033",
            border: "2px solid #c19a49",
            borderRadius: "20px",
            padding: isMobile
              ? "25px 15px"
              : "35px 35px",
          }}
        >
          {/* TOP FOOTER */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "1.3fr 1fr 1fr",
              gap: "25px",
              alignItems: "start",
            }}
          >
            {/* LOGO & TITLE */}
            <div>
              <img
                src={logo}
                alt="Atithi Logo"
                style={{
                  width: isMobile
                    ? "110px"
                    : "160px",
                  marginBottom: "12px",
                  objectFit: "contain",
                }}
              />

              <p
                style={{
                  color: "#6b4c2e",
                  lineHeight: "1.7",
                  fontSize: isMobile
                    ? "13px"
                    : "15px",
                  maxWidth: "280px",
                }}
              >
                Serving authentic Indian
                vegetarian cuisine with
                tradition, purity &
                unforgettable taste in
                Calgary.
              </p>
            </div>

            {/* CONTACT */}
            <div>
              <h3
                style={{
                  color: "#8b1e12",
                  marginBottom: "14px",
                  fontSize: "17px",
                }}
              >
                CONTACT
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: "#5c4033",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                <span>
                  📍 Calgary, Alberta, Canada
                </span>

                <span>
                  📞 +1 587-333-2292
                </span>

                <span>
                  ✉️
                  careers@atithirestaurants.com
                </span>
              </div>
            </div>

            {/* WEBSITE */}
            <div>
              <h3
                style={{
                  color: "#8b1e12",
                  marginBottom: "14px",
                  fontSize: "17px",
                }}
              >
                WEBSITE
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: "#5c4033",
                  fontSize: "14px",
                }}
              >
                <span>
                  www.atithicalgary.com
                </span>

                <span>
                  Pure Veg • Family Restaurant
                </span>

                <span>
                  Fresh Ingredients Everyday
                </span>
              </div>
            </div>
          </div>

          {/* SMALL LINE */}
          <div
            style={{
              height: "1px",
              background: "#c19a49",
              margin: "25px 0 18px",
            }}
          />

          {/* COPYRIGHT */}
          <p
            style={{
              textAlign: "center",
              color: "#7d5a1b",
              fontSize: "13px",
              letterSpacing: "1px",
              margin: "0",
            }}
          >
           ATITHI PURE VEG CALGARY.
            All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}