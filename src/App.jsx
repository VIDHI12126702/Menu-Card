import React, { useEffect, useMemo, useState } from "react";

const ADMIN_PIN = "admin123";
const ORDER_PHONE = "+16475558901";

const defaultItems = [
  {
    id: 1,
    name: "Truffle Mushroom Pasta",
    category: "Mains",
    price: 18.99,
    desc: "Creamy parmesan sauce, wild mushrooms, garlic butter, fresh herbs.",
    tag: "Chef Special",
    available: true,
    deal: true,
    dealText: "Today 15% OFF",
  },
  {
    id: 2,
    name: "Smoked Chicken Panini",
    category: "Sandwiches",
    price: 14.5,
    desc: "Grilled sourdough, smoked chicken, cheddar, pesto mayo.",
    tag: "Popular",
    available: true,
    deal: false,
    dealText: "",
  },
  {
    id: 3,
    name: "Signature Cappuccino",
    category: "Coffee",
    price: 5.75,
    desc: "Rich espresso with velvety steamed milk and cocoa dust.",
    tag: "Hot",
    available: true,
    deal: false,
    dealText: "",
  },
  {
    id: 4,
    name: "Iced Caramel Latte",
    category: "Coffee",
    price: 6.5,
    desc: "Cold espresso, caramel syrup, chilled milk, ice.",
    tag: "Best Seller",
    available: true,
    deal: true,
    dealText: "Combo with pastry $9.99",
  },
  {
    id: 5,
    name: "Belgian Chocolate Waffle",
    category: "Desserts",
    price: 11.99,
    desc: "Warm waffle, Belgian chocolate, vanilla cream, berries.",
    tag: "Sweet",
    available: true,
    deal: false,
    dealText: "",
  },
  {
    id: 6,
    name: "Avocado Garden Toast",
    category: "Breakfast",
    price: 12.25,
    desc: "Sourdough toast, smashed avocado, cherry tomatoes, feta.",
    tag: "Fresh",
    available: true,
    deal: false,
    dealText: "",
  },
];

function currency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(Number(value || 0));
}

function emptyForm() {
  return {
    name: "",
    category: "Coffee",
    price: "",
    desc: "",
    tag: "",
    available: true,
    deal: false,
    dealText: "",
  };
}

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("premiumMenuItems");
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [adminOpen, setAdminOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Today’s Deals");
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("premiumMenuItems", JSON.stringify(items));
  }, [items]);

  const deals = items.filter((item) => item.available && item.deal && item.dealText);

  const categories = useMemo(() => {
    const mainOrder = ["Today’s Deals", "Mains", "Coffee", "Desserts", "Breakfast", "Sandwiches"];
    const existing = new Set(items.map((item) => item.category));
    return mainOrder.filter((cat) => cat === "Today’s Deals" || existing.has(cat));
  }, [items]);

  const visibleItems = items.filter((item) => {
    const matchCategory =
      selectedCategory === "Today’s Deals"
        ? item.deal && item.dealText
        : item.category === selectedCategory;

    return item.available && matchCategory;
  });

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  }

  function loginAdmin(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setLoggedIn(true);
      setPin("");
    } else {
      alert("Wrong admin PIN");
    }
  }

  function saveItem(e) {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Please enter food name, category and price");
      return;
    }

    const updatedItem = {
      ...form,
      id: editingId || Date.now(),
      price: Number(form.price),
      dealText: form.deal ? form.dealText : "",
    };

    if (editingId) {
      setItems((prev) => prev.map((item) => (item.id === editingId ? updatedItem : item)));
      showMessage("Menu updated successfully");
    } else {
      setItems((prev) => [updatedItem, ...prev]);
      showMessage("New item added successfully");
    }

    setEditingId(null);
    setForm(emptyForm());
    setAdminOpen(false);
    setSelectedCategory(updatedItem.deal ? "Today’s Deals" : updatedItem.category);
  }

  function editItem(item) {
    setForm({ ...item, price: String(item.price) });
    setEditingId(item.id);
    setAdminOpen(true);
    setLoggedIn(true);
  }

  function deleteItem(id) {
    const item = items.find((menuItem) => menuItem.id === id);
    if (confirm(`Delete ${item?.name || "this item"}?`)) {
      setItems((prev) => prev.filter((menuItem) => menuItem.id !== id));
      showMessage(item?.deal ? "Deal deleted successfully" : "Menu item deleted successfully");
    }
  }

  function closeAdmin() {
    setAdminOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  return (
    <div className="app">
      <style>{css}</style>

      {message && <div className="toastMsg">{message}</div>}

      <header className="hero">
        <nav className="nav">
          <div className="brandBox">
            <p className="eyebrow">Premium Cafe Menu</p>
            <h1>Velvet Bean Cafe</h1>
          </div>

          <button className="adminBtn desktopAdmin" onClick={() => setAdminOpen(true)}>
            Owner Panel
          </button>
        </nav>

        <div className="heroContent">
          <p className="badge">Scan QR • Choose Food • Order Fresh</p>
          <h2>Premium digital menu for fast ordering.</h2>
          <p>Choose today’s deals or category, then tap Order Now to contact the cafe.</p>
        </div>
      </header>

      {adminOpen && (
        <div className="adminOverlay">
          <section className="adminPanel">
            <div className="adminPanelTop">
              <div>
                <p>Owner Area</p>
                <h2>Manage Menu</h2>
              </div>
              <button className="closeBtn" onClick={closeAdmin}>Back To Menu</button>
            </div>

            {!loggedIn ? (
              <form onSubmit={loginAdmin} className="loginBox">
                <h3>Owner Login</h3>
                <p>Only owner can change menu details.</p>
                <input
                  type="password"
                  placeholder="Enter admin PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button type="submit">Login</button>
              </form>
            ) : (
              <div className="adminGrid">
                <form onSubmit={saveItem} className="menuForm">
                  <div className="formTitleRow">
                    <h3>{editingId ? "Update Item" : "Add New Item"}</h3>
                    <button type="button" className="logoutBtn" onClick={() => setLoggedIn(false)}>
                      Logout
                    </button>
                  </div>

                  <input
                    placeholder="Food / Drink name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price in CAD"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <input
                    placeholder="Small tag, example: Best Seller"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />

                  <label className="checkLine">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    />
                    Available to customers
                  </label>

                  <label className="checkLine">
                    <input
                      type="checkbox"
                      checked={form.deal}
                      onChange={(e) => setForm({ ...form, deal: e.target.checked })}
                    />
                    Show as deal
                  </label>

                  <input
                    placeholder="Deal text, example: Buy 1 Get 1 Free"
                    value={form.dealText}
                    onChange={(e) => setForm({ ...form, dealText: e.target.value })}
                  />

                  <button type="submit">{editingId ? "Save Changes" : "Add Item"}</button>
                </form>

                <div className="adminList">
                  <h3>Current Menu</h3>
                  {items.map((item) => (
                    <div className="adminItem" key={item.id}>
                      <div>
                        <b>{item.name}</b>
                        <p>
                          {currency(item.price)} • {item.category}
                          {item.deal && item.dealText ? " • Deal" : ""}
                        </p>
                      </div>
                      <div className="rowBtns">
                        <button onClick={() => editItem(item)}>Edit</button>
                        <button className="danger" onClick={() => deleteItem(item.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      <button className="mobileOwnerBtn" onClick={() => setAdminOpen(true)}>
        Owner
      </button>

      <main className="container">
        <section className="filters">
          <div className="menuTitleBox">
            <span>Menu</span>
            <h2>{selectedCategory}</h2>
            {selectedCategory === "Today’s Deals" && (
              <p>{deals.length} special offer{deals.length !== 1 ? "s" : ""}</p>
            )}
          </div>

          <div className="tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={selectedCategory === cat ? "active" : cat === "Today’s Deals" ? "dealTab" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "Today’s Deals" ? `Today’s Deals ${deals.length > 0 ? `(${deals.length})` : ""}` : cat}
              </button>
            ))}
          </div>
        </section>

        <section className="menuGrid">
          {visibleItems.length === 0 ? (
            <div className="emptyBox">
              <h3>No items available</h3>
              <p>Please check another menu category.</p>
            </div>
          ) : (
            visibleItems.map((item) => (
              <article className="card" key={item.id}>
                <div className="cardTop">
                  <span>{item.category}</span>
                  {item.tag && <b>{item.tag}</b>}
                </div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                {item.deal && item.dealText && <div className="dealBadge">{item.dealText}</div>}
                <div className="priceRow">
                  <strong>{currency(item.price)}</strong>
                  {loggedIn ? (
                    <button onClick={() => editItem(item)}>Edit</button>
                  ) : (
                    <a className="orderBtn" href={`tel:${ORDER_PHONE}`}>
                      Order Now
                    </a>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <footer>
        <div className="footerGrid">
          <div>
            <h3>Velvet Bean Cafe</h3>
            <p>Fresh Taste • Premium Experience</p>
          </div>

          <div>
            <h4>Address</h4>
            <p>125 Downtown Street,<br />Toronto, Ontario, Canada</p>
          </div>

          <div>
            <h4>Contact</h4>
            <p>+1 (647) 555-8901</p>
            <p>hello@velvetbean.ca</p>
          </div>

          <div>
            <h4>Opening Hours</h4>
            <p>Mon - Fri : 8:00 AM - 10:00 PM</p>
            <p>Sat - Sun : 9:00 AM - 11:30 PM</p>
          </div>
        </div>

        <div className="footerBottom">© 2026 Velvet Bean Cafe • All Rights Reserved</div>
      </footer>
    </div>
  );
}

const css = `
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, Arial, sans-serif; background: #080503; }
.app { min-height: 100vh; position: relative; overflow-x: hidden; color: white; background: #0c0806; }
.app:before, .app:after { content: ""; position: fixed; width: 420px; height: 420px; border-radius: 50%; filter: blur(80px); opacity: .25; z-index: 0; pointer-events: none; }
.app:before { background: #d8b36a; top: -120px; left: -120px; }
.app:after { background: #7c3f16; right: -140px; bottom: 10%; }
.hero, .container, footer { position: relative; z-index: 1; }
.toastMsg { position: fixed; top: 22px; left: 50%; transform: translateX(-50%); z-index: 10000; padding: 14px 22px; border-radius: 999px; background: linear-gradient(135deg, #ffe1a0, #d8b36a); color: #160d07; font-weight: 900; box-shadow: 0 18px 50px rgba(0,0,0,.4); }
.hero { min-height: 520px; background: radial-gradient(circle at 20% 20%, rgba(216,179,106,.24), transparent 32%), linear-gradient(120deg, rgba(8,5,3,.96), rgba(34,18,8,.76)), url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=85'); background-size: cover; background-position: center; border-bottom: 1px solid rgba(255,255,255,.1); }
.nav { max-width: 1220px; margin: auto; padding: 28px 22px; display: flex; align-items: center; justify-content: space-between; }
.brandBox { padding: 12px 18px; border-radius: 22px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(14px); }
.eyebrow { color: #ffd98a; margin: 0; letter-spacing: 3px; text-transform: uppercase; font-size: 11px; font-weight: 800; }
h1 { margin: 5px 0 0; font-size: 30px; letter-spacing: -.5px; }
.mobileOwnerBtn { display: none; }
button, .adminBtn { border: 0; border-radius: 999px; padding: 13px 19px; background: linear-gradient(135deg, #ffe1a0, #d8b36a 45%, #8a5a22); color: #120b06; font-weight: 900; cursor: pointer; box-shadow: 0 14px 30px rgba(216,179,106,.22); }
.heroContent { max-width: 920px; margin: 64px auto 0; text-align: center; padding: 22px; }
.badge { display: inline-flex; padding: 10px 18px; border-radius: 999px; background: rgba(216,179,106,.15); border: 1px solid rgba(255,217,138,.36); color: #ffd98a; font-weight: 800; }
.heroContent h2 { font-size: clamp(40px, 7vw, 84px); line-height: .98; margin: 24px 0; letter-spacing: -3px; background: linear-gradient(180deg, #fff8e8, #ffd98a 55%, #a96d24); -webkit-background-clip: text; color: transparent; }
.heroContent p { color: #f4e0c0; font-size: 19px; max-width: 720px; margin: auto; line-height: 1.7; }
.container { max-width: 1220px; margin: auto; padding: 28px 22px 44px; }
.filters { position: sticky; top: 12px; z-index: 5; display: flex; gap: 16px; align-items: center; justify-content: space-between; margin-bottom: 28px; padding: 16px; border-radius: 28px; background: rgba(20,12,7,.85); border: 1px solid rgba(255,255,255,.1); backdrop-filter: blur(16px); }
.menuTitleBox { min-width: 190px; }
.menuTitleBox span { color: #ffd98a; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 900; }
.menuTitleBox h2 { margin: 3px 0 0; font-size: 30px; }
.menuTitleBox p { margin: 4px 0 0; color: #d9c7ae; font-size: 13px; }
.tabs { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.tabs button { background: rgba(255,255,255,.08); color: #f6e7ce; border: 1px solid rgba(255,255,255,.11); box-shadow: none; }
.tabs button.active { background: #d8b36a; color: #160d07; }
.dealTab { background: linear-gradient(135deg, #ffe1a0, #d8b36a) !important; color: #160d07 !important; }
.menuGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.card { position: relative; overflow: hidden; min-height: 310px; padding: 26px; border-radius: 34px; background: linear-gradient(160deg, rgba(255,255,255,.13), rgba(255,255,255,.04)), radial-gradient(circle at top right, rgba(255,217,138,.18), transparent 38%); border: 1px solid rgba(255,255,255,.13); box-shadow: 0 24px 70px rgba(0,0,0,.32); }
.card:before { content: ""; position: absolute; width: 150px; height: 150px; border-radius: 50%; background: rgba(216,179,106,.13); right: -55px; top: -55px; }
.cardTop, .priceRow { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.cardTop span { color: #ffd98a; font-size: 12px; text-transform: uppercase; letter-spacing: 1.6px; font-weight: 900; }
.cardTop b { background: rgba(216,179,106,.18); color: #ffd98a; padding: 8px 11px; border-radius: 999px; font-size: 12px; border: 1px solid rgba(255,217,138,.2); }
.card h3 { position: relative; z-index: 1; font-size: 27px; margin: 34px 0 13px; letter-spacing: -.8px; }
.card p { position: relative; z-index: 1; color: #d9c7ae; line-height: 1.65; min-height: 78px; }
.dealBadge { position: relative; z-index: 1; display: inline-block; margin: 12px 0 4px; padding: 9px 13px; border-radius: 16px; background: rgba(255,217,138,.17); color: #ffd98a; border: 1px solid rgba(255,217,138,.28); font-weight: 800; }
.priceRow { margin-top: 20px; }
.priceRow strong { font-size: 30px; color: #ffd98a; letter-spacing: -.8px; }
.orderBtn { text-decoration: none; border-radius: 999px; padding: 10px 14px; background: linear-gradient(135deg, #ffe1a0, #d8b36a); color: #160d07; font-weight: 900; font-size: 13px; }
.emptyBox { grid-column: 1 / -1; padding: 34px; border-radius: 28px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); text-align: center; color: #d9c7ae; }
.adminOverlay { position: fixed; inset: 0; z-index: 9999; padding: 24px; overflow-y: auto; background: rgba(0,0,0,.72); backdrop-filter: blur(12px); }
.adminPanel { max-width: 1180px; margin: 20px auto; background: linear-gradient(160deg, rgba(38,25,14,.98), rgba(13,8,5,.98)); border: 1px solid rgba(255,255,255,.16); border-radius: 34px; padding: 24px; box-shadow: 0 28px 80px rgba(0,0,0,.6); }
.adminPanelTop { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 20px; }
.adminPanelTop p { margin: 0 0 4px; color: #ffd98a; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; font-weight: 900; }
.adminPanelTop h2 { margin: 0; font-size: 32px; }
.closeBtn, .logoutBtn { background: rgba(255,255,255,.1); color: #fff; border: 1px solid rgba(255,255,255,.16); box-shadow: none; }
.formTitleRow { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.formTitleRow h3 { margin: 0; }
.loginBox, .menuForm, .adminList { background: rgba(0,0,0,.28); border: 1px solid rgba(255,255,255,.1); border-radius: 28px; padding: 24px; }
.loginBox h3, .menuForm h3, .adminList h3 { margin-top: 0; font-size: 24px; }
.loginBox p { color: #d9c7ae; }
.adminGrid { display: grid; grid-template-columns: .9fr 1.25fr; gap: 24px; }
input, textarea { width: 100%; margin: 8px 0; padding: 15px 16px; border-radius: 18px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.075); color: white; outline: none; }
textarea { min-height: 96px; resize: vertical; }
input::placeholder, textarea::placeholder { color: #cdbca5; }
.checkLine { display: flex; gap: 10px; align-items: center; margin: 12px 0; color: #ecd6b5; }
.checkLine input { width: auto; accent-color: #d8b36a; }
.adminItem { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,.1); }
.adminItem:last-child { border-bottom: 0; }
.adminItem p { margin: 5px 0 0; color: #cdbca5; }
.rowBtns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.rowBtns button { padding: 9px 13px; }
.danger { background: linear-gradient(135deg, #ff8585, #d73838); color: white; }
footer { margin-top: 40px; color: #d8c6ac; padding: 50px 22px 34px; border-top: 1px solid rgba(255,255,255,.08); background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01)); }
.footerGrid { max-width: 1220px; margin: auto; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; }
.footerGrid h3 { margin-top: 0; font-size: 28px; color: #ffd98a; }
.footerGrid h4 { margin-top: 0; margin-bottom: 12px; color: #ffd98a; font-size: 17px; }
.footerGrid p { margin: 6px 0; line-height: 1.7; color: #c9b79d; }
.footerBottom { max-width: 1220px; margin: 34px auto 0; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.08); text-align: center; color: #9f907a; font-size: 14px; }
@media (max-width: 1050px) { .menuGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .adminGrid { grid-template-columns: 1fr; } }
@media (max-width: 720px) {
  .app:before, .app:after { width: 260px; height: 260px; filter: blur(60px); }
  .hero { min-height: 380px; border-radius: 0 0 34px 34px; background-position: center top; }
  .nav { padding: 18px 16px; }
  .brandBox { padding: 10px 13px; border-radius: 18px; }
  .eyebrow { font-size: 9px; letter-spacing: 2px; }
  h1 { font-size: 20px; }
  .desktopAdmin { display: none; }
  .mobileOwnerBtn { display: block; position: fixed; right: 14px; bottom: 92px; z-index: 999; width: 62px; height: 62px; padding: 0; border-radius: 50%; font-size: 12px; box-shadow: 0 18px 45px rgba(0,0,0,.45); }
  .heroContent { margin-top: 22px; padding: 18px; text-align: left; }
  .badge { font-size: 12px; padding: 9px 13px; }
  .heroContent h2 { font-size: 38px; line-height: 1.02; letter-spacing: -1.5px; margin: 18px 0 14px; }
  .heroContent p { font-size: 14px; line-height: 1.55; margin: 0; }
  .toastMsg { top: 14px; width: calc(100% - 30px); text-align: center; border-radius: 18px; }
  .container { padding: 12px 12px 112px; }
  .filters { top: 8px; flex-direction: column; align-items: stretch; gap: 12px; margin-bottom: 16px; padding: 12px; border-radius: 24px; background: rgba(20,12,7,.92); }
  .menuTitleBox { min-width: auto; }
  .menuTitleBox span { font-size: 11px; }
  .menuTitleBox h2 { font-size: 24px; }
  .menuTitleBox p { font-size: 12px; }
  .tabs { justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tabs button { white-space: nowrap; padding: 11px 15px; font-size: 13px; }
  .menuGrid { grid-template-columns: 1fr; gap: 14px; }
  .card { min-height: auto; padding: 18px; border-radius: 26px; display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; }
  .card:before { width: 105px; height: 105px; right: -44px; top: -44px; }
  .cardTop { grid-column: 1 / -1; }
  .card h3 { grid-column: 1 / -1; font-size: 21px; margin: 12px 0 2px; line-height: 1.2; }
  .card p { grid-column: 1 / -1; min-height: 0; font-size: 13.5px; line-height: 1.5; margin: 4px 0; }
  .dealBadge { grid-column: 1 / -1; width: fit-content; font-size: 12px; padding: 8px 10px; margin: 6px 0 0; }
  .priceRow { grid-column: 1 / -1; margin-top: 6px; }
  .priceRow strong { font-size: 24px; }
  .orderBtn { padding: 10px 13px; font-size: 12px; }
  .adminOverlay { padding: 10px; }
  .adminPanel { margin: 0 auto; padding: 16px; border-radius: 26px; }
  .adminPanelTop { align-items: flex-start; flex-direction: column; }
  .adminPanelTop h2 { font-size: 26px; }
  .closeBtn, .logoutBtn { width: 100%; }
  .loginBox, .menuForm, .adminList { border-radius: 22px; padding: 16px; }
  .formTitleRow { align-items: flex-start; flex-direction: column; }
  input, textarea { padding: 14px; border-radius: 15px; font-size: 16px; }
  .adminItem { align-items: flex-start; flex-direction: column; }
  .rowBtns { justify-content: flex-start; }
  footer { margin-top: 24px; padding: 30px 16px 120px; }
  .footerGrid { grid-template-columns: 1fr; gap: 18px; }
  .footerGrid h3 { font-size: 24px; }
  .footerGrid h4 { margin-bottom: 6px; font-size: 15px; }
  .footerGrid p { font-size: 13px; line-height: 1.6; }
  .footerBottom { margin-top: 22px; padding-top: 18px; font-size: 12px; }
}
`;
