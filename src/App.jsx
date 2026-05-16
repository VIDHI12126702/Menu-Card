
import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import logo from "./assets/Atithi Logo.png";

const layouts = [
  {
    key: "breakfast",
    title: "BREAKFAST MENU",
  },
  {
    key: "starter",
    title: "STARTERS & STREET FOOD",
  },
  {
    key: "swaminarayan",
    title: "SPECIAL SWAMINARAYAN MENU",
  },
  {
    key: "lunch",
    title: "ATITHI LUNCH EXPRESS",
  },
  {
    key: "main",
    title: "MAINS, CURRIES & RICE",
  },
  {
    key: "signature",
    title: "ATITHI SIGNATURES",
  },
  {
    key: "beverage",
    title: "BEVERAGES",
  },
  {
    key: "dessert",
    title: "DESSERTS",
  },
];

export default function App() {
  const [menuData, setMenuData] = useState({});
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchMenu(true);
  }, []);

  const showMessage = (text) => {
    setMessage(text);
  };

  const fetchMenu = async (
    firstLoad = false
  ) => {
    if (firstLoad) {
      setLoading(true);
    }

    const updatedData = {};

    for (const layout of layouts) {
      const { data } = await supabase
        .from("menu")
        .select("*")
        .eq("layout", layout.key)
        .order("id");

      updatedData[layout.key] = (data || []).map(
        (section) => ({
          ...section,
          items: Array.isArray(section.items)
            ? section.items
            : [],
        })
      );
    }

    setMenuData(updatedData);

    if (firstLoad) {
      setLoading(false);
    }
  };

  const ownerLogin = () => {
    const password = prompt(
      "Enter Owner Password"
    );

    if (password === "atithi123") {
      setIsAdmin(true);

      showMessage("Owner Login Success");
    } else {
      alert("Wrong Password");
    }
  };

  const logoutOwner = () => {
    setIsAdmin(false);

    setEditing(false);

    showMessage("Customer View Enabled");
  };

  const addSection = async () => {
    const title = prompt(
      "Enter Section Title"
    );

    if (!title) return;

    const layout = prompt(`Enter Layout:

breakfast
starter
swaminarayan
lunch
main
signature
beverage
dessert`);

    if (!layout) return;

    await supabase.from("menu").insert([
      {
        title,
        layout,
        items: [],
      },
    ]);

    fetchMenu();

    showMessage("Section Added");
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading Menu...
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* TOP BAR */}

        <div style={topBarStyle}>
          {!isAdmin ? (
            <button
              onClick={ownerLogin}
              style={buttonStyle("#8b1e12")}
            >
              Owner Login
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  setEditing(!editing)
                }
                style={buttonStyle("#0d7a3f")}
              >
                {editing
                  ? "Preview Mode"
                  : "Edit Mode"}
              </button>

              <button
                onClick={addSection}
                style={buttonStyle("#9b7a1d")}
              >
                Add Section
              </button>

              <button
                onClick={() =>
                  fetchMenu()
                }
                style={buttonStyle("#005bbb")}
              >
                Refresh
              </button>

              <button
                onClick={logoutOwner}
                style={buttonStyle("#444")}
              >
                Customer View
              </button>
            </div>
          )}
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              background: "#0d7a3f",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>{message}</span>

            <button
              onClick={() =>
                setMessage("")
              }
              style={{
                background: "white",
                color: "#0d7a3f",
                border: "none",
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              X
            </button>
          </div>
        )}

        {/* LOGO */}

       
<img
  src={logo}
  alt="logo"
  style={{
    width: isMobile
      ? "220px"
      : "420px",
    objectFit: "contain",
  }}
/>



        {/* MENUS */}

        {layouts.map((layout) => (
          <div key={layout.key}>
            <MenuCard
              title={layout.title}
              layoutKey={layout.key}
              sections={
                menuData[layout.key] || []
              }
              editing={editing}
              isAdmin={isAdmin}
              fetchMenu={fetchMenu}
              showMessage={showMessage}
            />

            <Space />
          </div>
        ))}
      </div>
    </div>
  );
}

// MENU CARD

function MenuCard({
  title,
  layoutKey,
  sections,
  editing,
  isAdmin,
  fetchMenu,
  showMessage,
}) {
  const isMobile =
    window.innerWidth < 768;

  const addSubSection = async () => {
    const newTitle = prompt(
      "Enter Sub Section Title"
    );

    if (!newTitle) return;

    await supabase.from("menu").insert([
      {
        title: newTitle,
        layout: layoutKey,
        items: [],
      },
    ]);

    fetchMenu();

    showMessage("Sub Section Added");
  };

  return (
    <div style={cardStyle}>
      <div style={innerBorder}></div>

      <div style={cornerTopLeft}></div>

      <div style={cornerTopRight}></div>

      {/* TITLE */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "35px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {editing && isAdmin && (
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <button
              onClick={addSubSection}
              style={buttonStyle("#0d7a3f")}
            >
              + Add Sub Section
            </button>
          </div>
        )}

        <h1
          style={{
            color: "#9b7a1d",
            fontSize: isMobile
              ? "32px"
              : "48px",
            marginBottom: "8px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#6c4b2d",
            fontStyle: "italic",
          }}
        >
          Thoughtfully crafted
        </p>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "1fr 1fr",
          gap: "30px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {sections.map((section) => (
          <SectionBox
            key={section.id}
            section={section}
            editing={editing}
            isAdmin={isAdmin}
            fetchMenu={fetchMenu}
            showMessage={showMessage}
          />
        ))}
      </div>
    </div>
  );
}

// SECTION BOX

function SectionBox({
  section,
  editing,
  isAdmin,
  fetchMenu,
  showMessage,
}) {
  const isMobile =
    window.innerWidth < 768;

  const saveItems = async (
    updatedItems,
    text = "Saved Successfully"
  ) => {
    await supabase
      .from("menu")
      .update({
        items: updatedItems,
      })
      .eq("id", section.id);

    fetchMenu();

    showMessage(text);
  };

  const addItem = async () => {
    const updated = [
      ...section.items,
      {
        type: "item",
        name: "New Item",
        price: "0",
      },
    ];

    saveItems(updated, "Item Added");
  };

  const addNote = async () => {
    const updated = [
      ...section.items,
      {
        type: "note",
        name: "New Note",
      },
    ];

    saveItems(updated, "Note Added");
  };

  const deleteSection =
    async () => {
      const confirmDelete =
        window.confirm(
          "Delete Section?"
        );

      if (!confirmDelete) return;

      await supabase
        .from("menu")
        .delete()
        .eq("id", section.id);

      fetchMenu();

      showMessage("Section Deleted");
    };

  return (
    <div
      style={{
        background: "#fffaf0",
        border: "2px solid #d4af37",
        borderRadius: "18px",
        padding: isMobile
          ? "18px"
          : "24px",
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background:
            "linear-gradient(to right,#8b1e12,#d4af37,#8b1e12)",
        }}
      />

      {/* SECTION TITLE */}

      {editing && isAdmin ? (
        <input
          defaultValue={section.title}
          onBlur={async (e) => {
            await supabase
              .from("menu")
              .update({
                title:
                  e.target.value,
              })
              .eq(
                "id",
                section.id
              );

            fetchMenu();

            showMessage(
              "Section Updated"
            );
          }}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "22px",
            marginBottom: "20px",
            border:
              "2px solid #8b1e12",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              color: "#8b1e12",
              fontSize: isMobile
                ? "24px"
                : "28px",
              marginBottom: "8px",
            }}
          >
            {section.title}
          </h2>

          <div
            style={{
              width: "80px",
              height: "2px",
              background: "#d4af37",
              margin: "0 auto",
            }}
          />
        </div>
      )}

      {/* ADMIN BUTTONS */}

      {editing && isAdmin && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "22px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={addItem}
            style={buttonStyle("#0d7a3f")}
          >
            + Add Item
          </button>

          <button
            onClick={addNote}
            style={buttonStyle("#9b7a1d")}
          >
            + Add Note
          </button>

          <button
            onClick={deleteSection}
            style={buttonStyle("#b31212")}
          >
            Delete Section
          </button>
        </div>
      )}

      {/* ITEMS */}

      {section.items.map(
        (item, index) => {
          if (
            item.type ===
            "note"
          ) {
            return (
              <div
                key={index}
                style={{
                  marginBottom: "12px",
                }}
              >
                {editing &&
                isAdmin ? (
                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                    }}
                  >
                    <input
                      defaultValue={
                        item.name
                      }
                      onBlur={(
                        e
                      ) => {
                        const updated =
                          [
                            ...section.items,
                          ];

                        updated[
                          index
                        ].name =
                          e.target.value;

                        saveItems(
                          updated,
                          "Note Updated"
                        );
                      }}
                      style={{
                        ...inputStyle,
                        flex: 1,
                      }}
                    />

                    <button
                      onClick={() => {
                        const updated =
                          section.items.filter(
                            (
                              _,
                              i
                            ) =>
                              i !==
                              index
                          );

                        saveItems(
                          updated,
                          "Note Deleted"
                        );
                      }}
                      style={buttonStyle(
                        "#b31212"
                      )}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <p
                    style={{
                      fontStyle:
                        "italic",
                      color:
                        "#555",
                      textAlign:
                        "center",
                    }}
                  >
                    {item.name}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={index}>
              {editing &&
              isAdmin ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap:
                      "wrap",
                    marginBottom:
                      "12px",
                  }}
                >
                  <input
                    defaultValue={
                      item.name
                    }
                    onBlur={(
                      e
                    ) => {
                      const updated =
                        [
                          ...section.items,
                        ];

                      updated[
                        index
                      ].name =
                        e.target.value;

                        saveItems(
                          updated,
                          "Item Updated"
                        );
                    }}
                    style={{
                      ...inputStyle,
                      flex: 1,
                    }}
                  />

                  <input
                    defaultValue={
                      item.price
                    }
                    onBlur={(
                      e
                    ) => {
                      const updated =
                        [
                          ...section.items,
                        ];

                      updated[
                        index
                      ].price =
                        e.target.value;

                      saveItems(
                        updated,
                        "Price Updated"
                      );
                    }}
                    style={{
                      ...inputStyle,
                      width:
                        "90px",
                    }}
                  />

                  <button
                    onClick={() => {
                      const updated =
                        section.items.filter(
                          (
                            _,
                            i
                          ) =>
                            i !==
                            index
                        );

                      saveItems(
                        updated,
                        "Item Deleted"
                      );
                    }}
                    style={buttonStyle(
                      "#b31212"
                    )}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <MenuItem
                  name={item.name}
                  price={item.price}
                />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

// MENU ITEM

function MenuItem({
  name,
  price,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        borderBottom:
          "1px dashed #d4af37",
        padding: "12px 0",
      }}
    >
      <span
        style={{
          color: "#3b2a1a",
          fontSize: "16px",
        }}
      >
        {name}
      </span>

      <span
        style={{
          color: "#8b1e12",
          fontWeight: "bold",
          fontSize: "17px",
        }}
      >
        ${price}
      </span>
    </div>
  );
}

// SPACE

function Space() {
  return (
    <div
      style={{
        marginTop: "60px",
      }}
    />
  );
}

// STYLES

const pageStyle = {
  background: "#f7f0e1",
  minHeight: "100vh",
  padding: "20px",
  fontFamily: "Georgia, serif",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f7f0e1",
  fontSize: "30px",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};

const logoWrap = {
  textAlign: "center",
  marginBottom: "25px",
};

const cardStyle = {
  background: "#f9f2e4",
  border: "2px solid #c8993e",
  padding: "30px 24px",
  position: "relative",
  overflow: "hidden",
  borderRadius: "22px",
};

const innerBorder = {
  position: "absolute",
  inset: "8px",
  border: "1px solid #d7b670",
  pointerEvents: "none",
  borderRadius: "16px",
};

const cornerTopLeft = {
  position: "absolute",
  top: "8px",
  left: "8px",
  width: "30px",
  height: "30px",
  borderTop: "3px solid #c8993e",
  borderLeft: "3px solid #c8993e",
  pointerEvents: "none",
};

const cornerTopRight = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "30px",
  height: "30px",
  borderTop: "3px solid #c8993e",
  borderRight: "3px solid #c8993e",
  pointerEvents: "none",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = (bg) => ({
  background: bg,
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});
