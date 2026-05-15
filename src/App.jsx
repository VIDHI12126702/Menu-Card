// FULL UPDATED APP.JSX

import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import logo from "./assets/Atithi Logo.png";

const layouts = [
  { key: "breakfast", title: "BREAKFAST MENU" },
  { key: "starter", title: "STARTERS & STREET FOOD" },
  { key: "swaminarayan", title: "SPECIAL SWAMINARAYAN MENU" },
  { key: "lunch", title: "ATITHI LUNCH EXPRESS" },
  { key: "main", title: "MAINS, CURRIES & RICE" },
  { key: "signature", title: "ATITHI SIGNATURES" },
  { key: "beverage", title: "BEVERAGES" },
  { key: "dessert", title: "DESSERTS" },
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
    if (firstLoad) setLoading(true);

    const updatedData = {};

    for (const layout of layouts) {
      const { data } = await supabase
        .from("menu")
        .select("*")
        .eq("layout", layout.key)
        .order("id");

      updatedData[layout.key] = (
        data || []
      ).map((section) => ({
        ...section,
        items: Array.isArray(section.items)
          ? section.items
          : [],
      }));
    }

    setMenuData(updatedData);

    if (firstLoad) setLoading(false);
  };

  const ownerLogin = () => {
    const password = prompt(
      "Enter Owner Password"
    );

    if (password === "atithi123") {
      setIsAdmin(true);

      showMessage(
        "Owner Login Success"
      );
    } else {
      alert("Wrong Password");
    }
  };

  const logoutOwner = () => {
    setIsAdmin(false);
    setEditing(false);

    showMessage(
      "Customer View Enabled"
    );
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

    await supabase
      .from("menu")
      .insert([
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
              style={buttonStyle(
                "#8b1e12"
              )}
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
                style={buttonStyle(
                  "#0d7a3f"
                )}
              >
                {editing
                  ? "Preview Mode"
                  : "Edit Mode"}
              </button>

              <button
                onClick={addSection}
                style={buttonStyle(
                  "#9b7a1d"
                )}
              >
                Add Section
              </button>

              <button
                onClick={() =>
                  fetchMenu()
                }
                style={buttonStyle(
                  "#005bbb"
                )}
              >
                Refresh
              </button>

              <button
                onClick={logoutOwner}
                style={buttonStyle(
                  "#444"
                )}
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
              padding:
                "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              fontWeight: "bold",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span>{message}</span>

            <button
              onClick={() =>
                setMessage("")
              }
              style={{
                background:
                  "white",
                color:
                  "#0d7a3f",
                border: "none",
                borderRadius:
                  "6px",
                padding:
                  "4px 10px",
                cursor: "pointer",
                fontWeight:
                  "bold",
              }}
            >
              X
            </button>
          </div>
        )}

        {/* LOGO */}

        <div style={logoWrap}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: isMobile
                ? "150px"
                : "230px",
              maxWidth: "100%",
            }}
          />
        </div>

        {/* MENUS */}

        {layouts.map((layout) => (
          <div key={layout.key}>
            <MenuCard
              title={layout.title}
              layoutKey={layout.key}
              sections={
                menuData[
                  layout.key
                ] || []
              }
              editing={editing}
              isAdmin={isAdmin}
              fetchMenu={fetchMenu}
              showMessage={
                showMessage
              }
            />

            <Space />
          </div>
        ))}
      </div>
    </div>
  );
}

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

  return (
    <div
      style={{
        ...cardStyle,
        padding: isMobile
          ? "20px 14px"
          : "30px 24px",
      }}
    >
      <div style={innerBorder}></div>

      <div
        style={
          cornerTopLeft
        }
      ></div>

      <div
        style={
          cornerTopRight
        }
      ></div>

      <div
        style={{
          textAlign: "center",
          marginBottom: isMobile
            ? "24px"
            : "35px",
          padding: isMobile
            ? "0 8px"
            : "0",
        }}
      >
        <TopAdmin
          editing={editing}
          isAdmin={isAdmin}
          layoutKey={layoutKey}
          fetchMenu={fetchMenu}
          showMessage={showMessage}
        />

        <h1
          style={{
            color: "#9b7a1d",
            fontSize: isMobile
              ? "24px"
              : "48px",
            lineHeight: "1.4",
            textAlign: "center",
            padding: isMobile
              ? "0 10px"
              : "0",
            letterSpacing: "1px",
            wordBreak: "break-word",
            overflowWrap:
              "break-word",
            marginBottom: "12px",
            marginTop: "10px",
            fontWeight: "700",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#6c4b2d",
            fontStyle: "italic",
            fontSize: isMobile
              ? "14px"
              : "16px",
            lineHeight: "1.5",
            padding: isMobile
              ? "0 8px"
              : "0",
          }}
        >
          Thoughtfully crafted
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "1fr 1fr",
          gap: isMobile
            ? "22px"
            : "30px",
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

function TopAdmin({
  editing,
  isAdmin,
  layoutKey,
  fetchMenu,
  showMessage,
}) {
  if (!editing || !isAdmin)
    return null;

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <button
        onClick={async () => {
          const newTitle = prompt(
            "Enter Sub Section Title"
          );

          if (!newTitle) return;

          await supabase
            .from("menu")
            .insert([
              {
                title: newTitle,
                layout: layoutKey,
                items: [],
              },
            ]);

          fetchMenu();

          showMessage(
            "Sub Section Added"
          );
        }}
        style={buttonStyle("#0d7a3f")}
      >
        + Add Sub Section
      </button>
    </div>
  );
}

function SectionBox({
  section,
  editing,
  isAdmin,
  fetchMenu,
  showMessage,
}) {
  return (
    <div
      style={{
        marginBottom: "30px",
      }}
    >
      <h2 style={sectionTitle}>
        {section.title}
      </h2>

      {section.items.map(
        (item, index) => (
          <MenuItem
            key={index}
            name={item.name}
            price={item.price}
          />
        )
      )}
    </div>
  );
}

function MenuItem({
  name,
  price,
}) {
  const isMobile =
    window.innerWidth < 768;

  return (
    <div style={menuItem}>
      <span
        style={{
          flex: 1,
          paddingRight: "10px",
        }}
      >
        {name}
      </span>

      <span
        style={{
          color: "#8b1e12",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        ${price}
      </span>
    </div>
  );
}

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
  fontFamily:
    "Georgia, serif",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent:
    "center",
  alignItems: "center",
  fontSize: "30px",
};

const topBarStyle = {
  display: "flex",
  justifyContent:
    "flex-end",
  marginBottom: "20px",
};

const logoWrap = {
  textAlign: "center",
  marginBottom: "25px",
};

const cardStyle = {
  background: "#f9f2e4",
  border:
    "2px solid #c8993e",
  padding: "30px 24px",
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
};

const sectionTitle = {
  color: "#6f130f",
  borderBottom:
    "2px solid #8b1e12",
  paddingBottom: "10px",
  marginBottom: "18px",
  lineHeight: "1.4",
  wordBreak: "break-word",
};

const menuItem = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "flex-start",
  borderBottom:
    "1px dotted #c8993e",
  padding: "10px 0",
  gap: "10px",
};

const innerBorder = {
  position: "absolute",
  inset: "8px",
  border:
    "1px solid #d7b670",
  pointerEvents: "none",
};

const cornerTopLeft = {
  position: "absolute",
  top: "8px",
  left: "8px",
  width: "30px",
  height: "30px",
  borderTop:
    "3px solid #c8993e",
  borderLeft:
    "3px solid #c8993e",
};

const cornerTopRight = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "30px",
  height: "30px",
  borderTop:
    "3px solid #c8993e",
  borderRight:
    "3px solid #c8993e",
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