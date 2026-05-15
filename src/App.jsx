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

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
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
        items: Array.isArray(
          section.items
        )
          ? section.items
          : [],
      }));
    }

    setMenuData(updatedData);
    setLoading(false);
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
        {/* LOGO */}

        <div style={logoWrap}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: isMobile
                ? "140px"
                : "220px",
              maxWidth: "100%",
            }}
          />
        </div>

        {/* ALL LAYOUTS */}

        {layouts.map((layout) => (
          <div
            key={layout.key}
            style={{
              marginBottom:
                isMobile
                  ? "20px"
                  : "40px",
            }}
          >
            <MenuCard
              title={layout.title}
              sections={
                menuData[
                  layout.key
                ] || []
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuCard({
  title,
  sections,
}) {
  const isMobile =
    window.innerWidth < 768;

  return (
    <div style={cardStyle}>
      {/* CORNERS */}

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

      {/* TITLE */}

      <div
        style={{
          textAlign:
            "center",
          marginBottom:
            isMobile
              ? "20px"
              : "35px",
        }}
      >
        <h1
          style={{
            color:
              "#9b7a1d",
            fontSize:
              isMobile
                ? "28px"
                : "48px",
            marginBottom: "8px",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color:
              "#6c4b2d",
            fontStyle:
              "italic",
            fontSize:
              isMobile
                ? "14px"
                : "18px",
          }}
        >
          Thoughtfully crafted
        </p>
      </div>

      {/* SECTIONS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "repeat(2,minmax(0,1fr))",
          gap:
            isMobile
              ? "20px"
              : "30px",
        }}
      >
        {sections.map((section) => (
          <SectionBox
            key={section.id}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}

function SectionBox({
  section,
}) {
  const isMobile =
    window.innerWidth < 768;

  return (
    <div>
      <h2 style={sectionTitle}>
        {section.title}
      </h2>

      {section.items.map(
        (item, index) => {
          if (
            item.type ===
            "note"
          ) {
            return (
              <p
                key={index}
                style={{
                  fontStyle:
                    "italic",
                  color: "#6c4b2d",
                  marginBottom:
                    "12px",
                  fontSize:
                    isMobile
                      ? "14px"
                      : "18px",
                }}
              >
                {item.name}
              </p>
            );
          }

          return (
            <MenuItem
              key={index}
              name={item.name}
              price={item.price}
            />
          );
        }
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
      <div
        style={{
          flex: 1,
          minWidth: 0,
          color: "#5c2e12",
          fontSize:
            isMobile
              ? "17px"
              : "21px",
          lineHeight: "1.5",
          wordBreak: "break-word",
        }}
      >
        {name}
      </div>

      <div
        style={{
          color: "#8b1e12",
          fontWeight: "bold",
          fontSize:
            isMobile
              ? "17px"
              : "21px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        ${price}
      </div>
    </div>
  );
}

// STYLES

const pageStyle = {
  background: "#eef1f5",
  minHeight: "100vh",
  padding:
    window.innerWidth < 768
      ? "10px"
      : "20px",
  fontFamily:
    "Georgia, serif",
  overflowX: "hidden",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1100px",
  margin: "0 auto",
};

const loadingStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent:
    "center",
  alignItems: "center",
  fontSize: "28px",
};

const logoWrap = {
  textAlign: "center",
  marginBottom: "25px",
};

const cardStyle = {
  background: "#f9f2e4",
  border:
    "2px solid #c8993e",
  padding:
    window.innerWidth < 768
      ? "20px"
      : "30px 24px",
  position: "relative",
  borderRadius: "14px",
  overflow: "hidden",
  width: "100%",
  boxSizing: "border-box",
};

const sectionTitle = {
  color: "#6f130f",
  borderBottom:
    "2px solid #8b1e12",
  paddingBottom: "6px",
  marginBottom: "18px",
  fontSize:
    window.innerWidth < 768
      ? "22px"
      : "32px",
  lineHeight: "1.2",
};

const menuItem = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "flex-start",
  borderBottom:
    "1px dotted #c8993e",
  padding: "12px 0",
  gap: "14px",
  flexWrap: "nowrap",
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