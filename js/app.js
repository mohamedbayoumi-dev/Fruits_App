const state = {
  fruits: [],
  filteredFruits: [],
  selectedFruitId: null,
  activeTab: "supplier",
  supplierEdits: {},
  sortConfig: {
    column: null,
    direction: "asc",
  },
  supplierFilter: "",
  supplierFilterRaw: "",
};

// ─────────────────────────────────────────────
// INITIALISATION
// ─────────────────────────────────────────────

function init() {
  state.fruits = loadFruitsFromStorage();
  state.fruits.forEach((fruit) => {
    fruit.image = normalizeImagePath(fruit.image);
  });
  state.filteredFruits = [...state.fruits];

  setupMasterPanelActions();
  renderFruitList(state.filteredFruits);
  attachSearchEvent();
  showEmptyState();

  if (state.fruits.length > 0) {
    selectFruit(state.fruits[0].id);
  }
}

// ─────────────────────────────────────────────
// DATA PERSISTENCE (localStorage)
// ─────────────────────────────────────────────

function loadFruitsFromStorage() {
  const saved = localStorage.getItem("fruitsAppData");
  if (!saved) return deepClone(fruitsData);

  try {
    const savedData = JSON.parse(saved);

    const mergedBaseFruits = fruitsData.map((fruit) => {
      const savedFruit = savedData.find((f) => f.id === fruit.id);
      if (!savedFruit) return deepClone(fruit);

      return {
        ...deepClone(fruit),
        ...deepClone(savedFruit),
        image: normalizeImagePath(savedFruit.image || fruit.image),
        suppliers: deepClone(savedFruit.suppliers || fruit.suppliers),
      };
    });

    const extraSavedFruits = savedData
      .filter((savedFruit) => !fruitsData.some((fruit) => fruit.id === savedFruit.id))
      .map((fruit) => ({
        ...deepClone(fruit),
        image: normalizeImagePath(fruit.image),
      }));

    return [...mergedBaseFruits, ...extraSavedFruits];
  } catch (e) {
    console.warn("Failed to parse localStorage data, using defaults.", e);
    return deepClone(fruitsData);
  }
}

function saveFruitsToStorage() {
  localStorage.setItem("fruitsAppData", JSON.stringify(state.fruits));
}

function setupMasterPanelActions() {
  const header = document.querySelector(".master-header");
  if (!header || document.getElementById("createFruitBtn")) return;

  const searchWrap = header.querySelector(".search-wrap");
  const actions = document.createElement("div");
  actions.className = "master-actions";
  actions.innerHTML = `
    <button class="btn btn-create btn-master" id="createFruitBtn">
      <i class="fa-solid fa-plus"></i> Create Item
    </button>
  `;

  header.insertBefore(actions, searchWrap);

  document.getElementById("createFruitBtn").addEventListener("click", () => {
    showCreateFruitModal();
  });
}

// ─────────────────────────────────────────────
// FRUIT LIST (LEFT PANEL)
// ─────────────────────────────────────────────

function renderFruitList(fruits) {
  const listEl = document.getElementById("fruitList");
  const countEl = document.getElementById("fruitCount");

  countEl.textContent = `${fruits.length} item${fruits.length !== 1 ? "s" : ""}`;

  if (fruits.length === 0) {
    listEl.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
        <p>No fruits found</p>
        <small>Try a different search term</small>
      </div>`;
    return;
  }

  listEl.innerHTML = fruits
    .map(
      (fruit) => `
    <div class="fruit-item ${state.selectedFruitId === fruit.id ? "active" : ""}"
         data-id="${fruit.id}"
         role="button"
         tabindex="0"
         aria-label="Select ${fruit.name}">
      <div class="fruit-item-image-wrap">
        <img src="${fruit.image}" alt="${fruit.name}" class="fruit-item-img" loading="lazy"
             onerror="this.src='https://via.placeholder.com/60x60/e8f5e9/2d6a4f?text=${fruit.name[0]}'">
      </div>
      <div class="fruit-item-info">
        <div class="fruit-item-name">${fruit.name}</div>
        <div class="fruit-item-category">
          <span class="category-badge category-${fruit.category.toLowerCase()}">${fruit.category}</span>
        </div>
        <div class="fruit-item-price">
          <span class="price-value">${fruit.price} EGP</span>
          <span class="price-unit">/ ${fruit.unit}</span>
        </div>
      </div>
      <div class="fruit-item-arrow"><i class="fa-solid fa-angle-right"></i></div>
    </div>
  `
    )
    .join("");

  listEl.querySelectorAll(".fruit-item").forEach((item) => {
    item.addEventListener("click", () => selectFruit(Number(item.dataset.id)));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectFruit(Number(item.dataset.id));
      }
    });
  });
}

function attachSearchEvent() {
  const searchEl = document.getElementById("searchInput");
  searchEl.addEventListener("input", () => {
    applyFruitSearchFilter(searchEl.value);
    renderFruitList(state.filteredFruits);
  });

  document.getElementById("clearSearch").addEventListener("click", () => {
    searchEl.value = "";
    applyFruitSearchFilter("");
    renderFruitList(state.filteredFruits);
    searchEl.focus();
  });
}

function applyFruitSearchFilter(rawQuery) {
  const query = rawQuery.trim().toLowerCase().normalize("NFC");

  if (query === "") {
    state.filteredFruits = [...state.fruits];
    return;
  }

  state.filteredFruits = state.fruits.filter((f) => {
    const name = f.name.toLowerCase().normalize("NFC");
    const category = f.category.toLowerCase().normalize("NFC");
    return name.includes(query) || category.includes(query);
  });
}

function showCreateFruitModal() {
  const existing = document.getElementById("createFruitModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "createFruitModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box modal-box-form" role="dialog" aria-modal="true" aria-labelledby="createFruitTitle">
      <div class="modal-header">
        <div class="modal-header-icon modal-header-icon-create">
          <i class="fa-solid fa-apple-whole"></i>
        </div>
        <div>
          <h3 class="modal-title" id="createFruitTitle">Create Item</h3>
          <p class="modal-subtitle">Add a new fruit item to the list</p>
        </div>
      </div>
      <form id="createFruitForm">
        <div class="modal-body modal-form-grid">
          <label class="modal-field">
            <span>Name</span>
            <input type="text" name="name" class="modal-input" placeholder="Fruit name" required>
          </label>
          <label class="modal-field">
            <span>Category</span>
            <select name="category" class="modal-input" required>
              <option value="Alkaline">Alkaline</option>
              <option value="Acidic">Acidic</option>
            </select>
          </label>
          <label class="modal-field">
            <span>Price</span>
            <input type="number" name="price" class="modal-input" min="0" step="0.01" placeholder="0" required>
          </label>
          <label class="modal-field">
            <span>Unit</span>
            <input type="text" name="unit" class="modal-input" placeholder="kg" required>
          </label>
          <label class="modal-field">
            <span>Type</span>
            <input type="text" name="type" class="modal-input" placeholder="Fruit type" required>
          </label>
          <label class="modal-field">
            <span>Primary Supplier</span>
            <input type="text" name="supplierName" class="modal-input" placeholder="Primary supplier" required>
          </label>
          <label class="modal-field modal-field-full">
            <span>Image Path</span>
            <input type="text" name="image" class="modal-input" placeholder="assets/image/fruit.png">
          </label>
          <label class="modal-field modal-field-full">
            <span>Description</span>
            <textarea name="description" class="modal-input modal-textarea" placeholder="Write a short description" required></textarea>
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" id="createFruitCancelBtn">
            <i class="fa-solid fa-times"></i> Cancel
          </button>
          <button type="submit" class="btn btn-create">
            <i class="fa-solid fa-check"></i> Add Item
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    setTimeout(() => modal.remove(), 250);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("createFruitCancelBtn").addEventListener("click", closeModal);

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  document.getElementById("createFruitForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fruit = {
      id: createFruitId(),
      name: formData.get("name").toString().trim(),
      category: formData.get("category").toString(),
      price: Number(formData.get("price")),
      unit: formData.get("unit").toString().trim(),
      image:
        normalizeImagePath(formData.get("image").toString().trim()) ||
        createFallbackImagePath(formData.get("name").toString().trim()),
      description: formData.get("description").toString().trim(),
      type: formData.get("type").toString().trim(),
      supplierName: formData.get("supplierName").toString().trim(),
      suppliers: [],
    };

    if (
      !fruit.name ||
      !fruit.category ||
      Number.isNaN(fruit.price) ||
      !fruit.unit ||
      !fruit.description ||
      !fruit.type ||
      !fruit.supplierName
    ) {
      showToast("Please complete all item fields.", "error");
      return;
    }

    addFruitItem(fruit);
    closeModal();
  });
}

function showDeleteFruitModal(fruitId) {
  const fruit = getFruitById(fruitId);
  if (!fruit) return;

  const existing = document.getElementById("deleteFruitModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "deleteFruitModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="deleteFruitTitle">
      <div class="modal-header">
        <div class="modal-header-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h3 class="modal-title" id="deleteFruitTitle">Delete Item</h3>
          <p class="modal-subtitle">This action cannot be undone</p>
        </div>
      </div>
      <div class="modal-body">
        <p class="modal-message">Are you sure you want to permanently delete this fruit item?</p>
        <div class="modal-supplier-card">
          <div class="modal-supplier-name">
            <i class="fa-solid fa-apple-whole"></i>
            ${escapeHtml(fruit.name)}
          </div>
          <div class="modal-supplier-meta">
            <span><i class="fa-solid fa-tag"></i> ${escapeHtml(fruit.category)}</span>
            <span><i class="fa-solid fa-money-bill-wave"></i> ${escapeHtml(fruit.price)} EGP / ${escapeHtml(fruit.unit)}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel" id="deleteFruitCancelBtn">
          <i class="fa-solid fa-times"></i> Cancel
        </button>
        <button class="btn btn-danger" id="deleteFruitConfirmBtn">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    setTimeout(() => modal.remove(), 250);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("deleteFruitCancelBtn").addEventListener("click", closeModal);
  document.getElementById("deleteFruitConfirmBtn").addEventListener("click", () => {
    deleteFruitItem(fruitId);
    closeModal();
  });

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}

function showEditFruitModal(fruitId) {
  const fruit = getFruitById(fruitId);
  if (!fruit) return;

  const existing = document.getElementById("editFruitModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "editFruitModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box modal-box-form" role="dialog" aria-modal="true" aria-labelledby="editFruitTitle">
      <div class="modal-header">
        <div class="modal-header-icon modal-header-icon-create">
          <i class="fa-solid fa-pen"></i>
        </div>
        <div>
          <h3 class="modal-title" id="editFruitTitle">Edit Item</h3>
          <p class="modal-subtitle">Update the selected fruit item</p>
        </div>
      </div>
      <form id="editFruitForm">
        <div class="modal-body modal-form-grid">
          <label class="modal-field">
            <span>Name</span>
            <input type="text" name="name" class="modal-input" value="${escapeHtml(fruit.name)}" required>
          </label>
          <label class="modal-field">
            <span>Category</span>
            <select name="category" class="modal-input" required>
              <option value="Alkaline" ${fruit.category === "Alkaline" ? "selected" : ""}>Alkaline</option>
              <option value="Acidic" ${fruit.category === "Acidic" ? "selected" : ""}>Acidic</option>
            </select>
          </label>
          <label class="modal-field">
            <span>Price</span>
            <input type="number" name="price" class="modal-input" min="0" step="0.01" value="${escapeHtml(fruit.price)}" required>
          </label>
          <label class="modal-field">
            <span>Unit</span>
            <input type="text" name="unit" class="modal-input" value="${escapeHtml(fruit.unit)}" required>
          </label>
          <label class="modal-field">
            <span>Type</span>
            <input type="text" name="type" class="modal-input" value="${escapeHtml(fruit.type)}" required>
          </label>
          <label class="modal-field">
            <span>Primary Supplier</span>
            <input type="text" name="supplierName" class="modal-input" value="${escapeHtml(fruit.supplierName)}" required>
          </label>
          <label class="modal-field modal-field-full">
            <span>Image Path</span>
            <input type="text" name="image" class="modal-input" value="${escapeHtml(fruit.image)}">
          </label>
          <label class="modal-field modal-field-full">
            <span>Description</span>
            <textarea name="description" class="modal-input modal-textarea" required>${escapeHtml(fruit.description)}</textarea>
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" id="editFruitCancelBtn">
            <i class="fa-solid fa-times"></i> Cancel
          </button>
          <button type="submit" class="btn btn-save">
            <i class="fa-solid fa-floppy-disk"></i> Update Item
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    setTimeout(() => modal.remove(), 250);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("editFruitCancelBtn").addEventListener("click", closeModal);

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  document.getElementById("editFruitForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const updates = {
      name: formData.get("name").toString().trim(),
      category: formData.get("category").toString(),
      price: Number(formData.get("price")),
      unit: formData.get("unit").toString().trim(),
      image: normalizeImagePath(formData.get("image").toString().trim()),
      description: formData.get("description").toString().trim(),
      type: formData.get("type").toString().trim(),
      supplierName: formData.get("supplierName").toString().trim(),
    };

    if (
      !updates.name ||
      !updates.category ||
      Number.isNaN(updates.price) ||
      !updates.unit ||
      !updates.description ||
      !updates.type ||
      !updates.supplierName
    ) {
      showToast("Please complete all item fields.", "error");
      return;
    }

    updates.image = updates.image || createFallbackImagePath(updates.name);
    updateFruitItem(fruitId, updates);
    closeModal();
  });
}

function addFruitItem(fruit) {
  state.fruits.push(fruit);
  applyFruitSearchFilter(document.getElementById("searchInput")?.value || "");
  saveFruitsToStorage();
  renderFruitList(state.filteredFruits);
  selectFruit(fruit.id);
  showToast("Item added successfully.", "success");
}

function updateFruitItem(fruitId, updates) {
  const fruit = getFruitById(fruitId);
  if (!fruit) return;

  Object.assign(fruit, updates);
  applyFruitSearchFilter(document.getElementById("searchInput")?.value || "");
  saveFruitsToStorage();
  renderFruitList(state.filteredFruits);

  if (state.filteredFruits.some((item) => item.id === fruitId)) {
    selectFruit(fruitId);
  } else if (state.filteredFruits.length > 0) {
    selectFruit(state.filteredFruits[0].id);
  } else {
    state.selectedFruitId = null;
    showEmptyState();
  }

  showToast("Item updated successfully.", "success");
}

function deleteFruitItem(fruitId) {
  const deletedWasSelected = state.selectedFruitId === fruitId;

  state.fruits = state.fruits.filter((fruit) => fruit.id !== fruitId);
  applyFruitSearchFilter(document.getElementById("searchInput")?.value || "");
  saveFruitsToStorage();
  renderFruitList(state.filteredFruits);

  if (state.fruits.length === 0) {
    state.selectedFruitId = null;
    showEmptyState();
  } else if (deletedWasSelected) {
    selectFruit(state.fruits[0].id);
  } else {
    const selectedFruit = getFruitById(state.selectedFruitId);
    if (selectedFruit) {
      renderDetailPanel(selectedFruit);
    }
  }

  showToast("Item deleted successfully.", "success");
}

// ─────────────────────────────────────────────
// FRUIT SELECTION & DETAIL VIEW
// ─────────────────────────────────────────────

function selectFruit(id) {
  state.selectedFruitId = id;
  state.activeTab = "supplier";
  state.supplierEdits = {};
  state.supplierFilter = "";
  state.supplierFilterRaw = "";

  const fruit = getFruitById(id);
  if (!fruit) return;

  document.querySelectorAll(".fruit-item").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.id) === id);
  });

  renderDetailPanel(fruit);

  if (window.innerWidth <= 768) {
    document.getElementById("detailPanel").scrollIntoView({ behavior: "smooth" });
  }
}

function renderDetailPanel(fruit) {
  const detailEl = document.getElementById("detailPanel");

  detailEl.innerHTML = `
    <div class="detail-header">
      <div class="detail-hero">
        <div class="detail-img-wrap">
          <img src="${fruit.image}" alt="${fruit.name}" class="detail-img"
               onerror="this.src='https://via.placeholder.com/180x180/e8f5e9/2d6a4f?text=${fruit.name[0]}'">
          <span class="category-badge category-${fruit.category.toLowerCase()} detail-badge">${fruit.category}</span>
        </div>
        <div class="detail-title-block">
          <h2 class="detail-fruit-name">${fruit.name}</h2>
          <p class="detail-description">${fruit.description}</p>
          <div class="detail-item-actions">
            <button class="btn btn-save" id="editFruitBtn">
              <i class="fa-solid fa-pen"></i> Edit Item
            </button>
            <button class="btn btn-danger" id="deleteFruitBtn">
              <i class="fa-solid fa-trash"></i> Delete Item
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs-nav" role="tablist">
      <button class="tab-btn ${state.activeTab === "supplier" ? "active" : ""}"
              data-tab="supplier" role="tab"
              aria-selected="${state.activeTab === "supplier"}">
        <span class="tab-icon">
          <i class="fa-solid fa-align-justify"></i>
        </span> Supplier Information
      </button>
      <button class="tab-btn ${state.activeTab === "moredata" ? "active" : ""}"
              data-tab="moredata" role="tab"
              aria-selected="${state.activeTab === "moredata"}">
        <span class="tab-icon">
          <i class="fa-solid fa-chart-bar"></i>
        </span> More Data
      </button>
    </div>

    <div class="tab-content" id="tabContent">
      ${state.activeTab === "supplier" ? renderSupplierTab(fruit) : renderMoreDataTab(fruit)}
    </div>
  `;

  detailEl.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeTab = btn.dataset.tab;
      state.supplierEdits = {};
      detailEl.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.tab === state.activeTab);
        b.setAttribute("aria-selected", b.dataset.tab === state.activeTab);
      });
      document.getElementById("tabContent").innerHTML =
        state.activeTab === "supplier"
          ? renderSupplierTab(fruit)
          : renderMoreDataTab(fruit);
      attachTabEvents(fruit);
    });
  });

  document.getElementById("editFruitBtn")?.addEventListener("click", () => {
    showEditFruitModal(fruit.id);
  });

  document.getElementById("deleteFruitBtn")?.addEventListener("click", () => {
    showDeleteFruitModal(fruit.id);
  });

  attachTabEvents(fruit);
}

// ─────────────────────────────────────────────
// MORE DATA TAB
// ─────────────────────────────────────────────

function renderMoreDataTab(fruit) {
  return `
    <div class="more-data-tab">
      <div class="more-data-grid">
        <div class="more-data-card">
          <div class="more-data-label">Fruit Type</div>
          <div class="more-data-value">${fruit.type}</div>
        </div>
        <div class="more-data-card">
          <div class="more-data-label">Price / Unit</div>
          <div class="more-data-value">${fruit.price} EGP / ${fruit.unit}</div>
        </div>
        <div class="more-data-card">
          <div class="more-data-label">Category</div>
          <div class="more-data-value">
            <span class="category-badge category-${fruit.category.toLowerCase()}">${fruit.category}</span>
          </div>
        </div>
        <div class="more-data-card">
          <div class="more-data-label">Primary Supplier</div>
          <div class="more-data-value">${fruit.supplierName}</div>
        </div>
        <div class="more-data-card">
          <div class="more-data-label">Total Suppliers</div>
          <div class="more-data-value">${fruit.suppliers.length}</div>
        </div>
        <div class="more-data-card">
          <div class="more-data-label">Unit</div>
          <div class="more-data-value">${fruit.unit.toUpperCase()}</div>
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// SUPPLIER INFO TAB
// ─────────────────────────────────────────────

function renderSupplierTab(fruit) {
  const rows = fruit.suppliers.map((sup) => {
    const edit = state.supplierEdits[sup.id];
    return edit ? { ...sup, ...edit } : { ...sup };
  });

  const filteredRows = state.supplierFilter
    ? rows.filter((r) => {
        const norm = (s) => (s || "").toLowerCase().normalize("NFC");
        return (
          norm(r.supplierName).includes(state.supplierFilter) ||
          norm(r.city).includes(state.supplierFilter) ||
          norm(r.contactPerson).includes(state.supplierFilter)
        );
      })
    : rows;

  const sortedRows = sortSupplierRows(filteredRows);

  return `
    <div class="supplier-tab">
      <div class="supplier-toolbar">
        <div class="supplier-filter-wrap">
          <span class="filter-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <input type="text" id="supplierFilter" dir="ltr" placeholder="Filter suppliers..."
                 class="supplier-filter-input" value="${escapeHtml(state.supplierFilterRaw)}">
          <button id="clearSearchSupplier" aria-label="Clear search">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="supplier-actions">
          <button class="btn btn-create" id="createSupplierBtn">
            <span>
              <i class="fa-solid fa-plus"></i>
            </span> Create Supplier
          </button>
          <button class="btn btn-save" id="saveBtn">
            <span>
              <i class="fa-solid fa-floppy-disk"></i>
            </span> Save
          </button>
          <button class="btn btn-cancel" id="cancelBtn">
            <span>
              <i class="fa-solid fa-times"></i>
            </span> Cancel
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="supplier-table" id="supplierTable">
          <thead>
            <tr>
              ${["supplierName", "sinceWhen", "city", "contactPerson", "phone"]
                .map(
                  (col) => `
                <th class="sortable ${state.sortConfig.column === col ? "sorted-" + state.sortConfig.direction : ""}"
                    data-col="${col}">
                  ${columnLabel(col)}
                  <span class="sort-icon">${getSortIcon(col)}</span>
                </th>
              `
                )
                .join("")}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${
              sortedRows.length === 0
                ? `<tr><td colspan="6" class="no-data">No suppliers match your filter.</td></tr>`
                : sortedRows.map((sup) => renderSupplierRow(sup)).join("")
            }
          </tbody>
        </table>
      </div>
      <div class="table-footer">
        ${sortedRows.length} supplier${sortedRows.length !== 1 ? "s" : ""} listed
      </div>
    </div>
  `;
}

function renderSupplierRow(sup) {
  const cityOptions = CITIES.map(
    (c) => `<option value="${c}" ${c === sup.city ? "selected" : ""}>${c}</option>`
  ).join("");

  return `
    <tr class="supplier-row" data-id="${sup.id}">
      <td>
        <input type="text" class="cell-input" data-field="supplierName"
               value="${escapeHtml(sup.supplierName)}" placeholder="Supplier name">
      </td>
      <td>
        <input type="date" class="cell-input" data-field="sinceWhen"
               value="${sup.sinceWhen}">
      </td>
      <td>
        <div class="city-field-wrap">
          <select class="cell-input city-select" data-field="city">
            ${cityOptions}
          </select>
          <span class="f4-icon" title="Value Help (F4)">
            <i class="fa-regular fa-square-caret-down fa-lg"></i>
          </span>
        </div>
      </td>
      <td>
        <input type="text" class="cell-input" data-field="contactPerson"
               value="${escapeHtml(sup.contactPerson)}" placeholder="Contact person">
      </td>
      <td>
        <input type="tel" class="cell-input" data-field="phone"
               value="${escapeHtml(sup.phone)}" placeholder="+1 234 567 8900">
      </td>
      <td class="actions-cell">
        <button class="btn-delete-supplier" data-id="${sup.id}" title="Delete supplier">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

// ─────────────────────────────────────────────
// DELETE SUPPLIER MODAL
// ─────────────────────────────────────────────

function showDeleteModal(supId, fruit) {
  const sup = fruit.suppliers.find((s) => s.id === supId);
  if (!sup) return;

  const existing = document.getElementById("deleteModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "deleteModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-header">
        <div class="modal-header-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h3 class="modal-title" id="modalTitle">Delete Supplier</h3>
          <p class="modal-subtitle">This action cannot be undone</p>
        </div>
      </div>
      <div class="modal-body">
        <p class="modal-message">Are you sure you want to permanently delete this supplier?</p>
        <div class="modal-supplier-card">
          <div class="modal-supplier-name">
            <i class="fa-solid fa-building"></i>
            ${escapeHtml(sup.supplierName)}
          </div>
          <div class="modal-supplier-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(sup.city)}</span>
            <span><i class="fa-solid fa-user"></i> ${escapeHtml(sup.contactPerson)}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel modal-cancel-btn" id="modalCancelBtn">
          <i class="fa-solid fa-times"></i> Cancel
        </button>
        <button class="btn btn-danger" id="modalDeleteBtn">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    setTimeout(() => modal.remove(), 250);
  };

  document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("modalDeleteBtn").addEventListener("click", () => {
    deleteSupplier(supId, fruit);
    closeModal();
  });

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}

function showCreateSupplierModal(fruit) {
  const existing = document.getElementById("createSupplierModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "createSupplierModal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box modal-box-form" role="dialog" aria-modal="true" aria-labelledby="createSupplierTitle">
      <div class="modal-header">
        <div class="modal-header-icon modal-header-icon-create">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div>
          <h3 class="modal-title" id="createSupplierTitle">Create Supplier</h3>
          <p class="modal-subtitle">Add a new supplier for ${escapeHtml(fruit.name)}</p>
        </div>
      </div>
      <form id="createSupplierForm">
        <div class="modal-body modal-form-grid">
          <label class="modal-field">
            <span>Supplier Name</span>
            <input type="text" name="supplierName" class="modal-input" placeholder="Enter supplier name" required>
          </label>
          <label class="modal-field">
            <span>Since When</span>
            <input type="date" name="sinceWhen" class="modal-input" required>
          </label>
          <label class="modal-field">
            <span>City</span>
            <select name="city" class="modal-input" required>
              ${CITIES.map((city) => `<option value="${city}">${city}</option>`).join("")}
            </select>
          </label>
          <label class="modal-field">
            <span>Contact Person</span>
            <input type="text" name="contactPerson" class="modal-input" placeholder="Enter contact person" required>
          </label>
          <label class="modal-field">
            <span>Phone</span>
            <input type="tel" name="phone" class="modal-input" placeholder="+20 100 000 0000" required>
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel modal-cancel-btn" id="createSupplierCancelBtn">
            <i class="fa-solid fa-times"></i> Cancel
          </button>
          <button type="submit" class="btn btn-create">
            <i class="fa-solid fa-check"></i> Add Supplier
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("modal-visible"));

  const closeModal = () => {
    modal.classList.remove("modal-visible");
    setTimeout(() => modal.remove(), 250);
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById("createSupplierCancelBtn").addEventListener("click", closeModal);

  const escHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);

  document.getElementById("createSupplierForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const supplier = {
      id: createSupplierId(),
      supplierName: formData.get("supplierName").toString().trim(),
      sinceWhen: formData.get("sinceWhen").toString(),
      city: formData.get("city").toString(),
      contactPerson: formData.get("contactPerson").toString().trim(),
      phone: formData.get("phone").toString().trim(),
    };

    if (
      !supplier.supplierName ||
      !supplier.sinceWhen ||
      !supplier.city ||
      !supplier.contactPerson ||
      !supplier.phone
    ) {
      showToast("Please complete all supplier fields.", "error");
      return;
    }

    addSupplierToFruit(fruit, supplier);
    closeModal();
  });
}

function deleteSupplier(supId, fruit) {
  const fruitInState = getFruitById(fruit.id);
  if (!fruitInState) return;

  fruitInState.suppliers = fruitInState.suppliers.filter((s) => s.id !== supId);
  saveFruitsToStorage();

  document.getElementById("tabContent").innerHTML = renderSupplierTab(fruitInState);
  attachTabEvents(fruitInState);

  showToast("Supplier deleted successfully.", "success");
}

function addSupplierToFruit(fruit, supplier) {
  const fruitInState = getFruitById(fruit.id);
  if (!fruitInState) return;

  fruitInState.suppliers.push(supplier);
  state.supplierEdits = {};
  saveFruitsToStorage();

  document.getElementById("tabContent").innerHTML = renderSupplierTab(fruitInState);
  attachTabEvents(fruitInState);

  showToast("Supplier added successfully.", "success");
}

// ─────────────────────────────────────────────
// TAB EVENT BINDING
// ─────────────────────────────────────────────

function attachTabEvents(fruit) {
  if (state.activeTab !== "supplier") return;

  document.querySelectorAll(".supplier-row").forEach((row) => {
    const supId = row.dataset.id;
    row.querySelectorAll(".cell-input").forEach((input) => {
      input.addEventListener("change", () => {
        if (!state.supplierEdits[supId]) state.supplierEdits[supId] = {};
        state.supplierEdits[supId][input.dataset.field] = input.value;
        row.classList.add("dirty");
      });
      input.addEventListener("input", () => {
        if (!state.supplierEdits[supId]) state.supplierEdits[supId] = {};
        state.supplierEdits[supId][input.dataset.field] = input.value;
        row.classList.add("dirty");
      });
    });
  });

  document.querySelectorAll(".btn-delete-supplier").forEach((btn) => {
    btn.addEventListener("click", () => {
      showDeleteModal(btn.dataset.id, fruit);
    });
  });

  document.getElementById("createSupplierBtn")?.addEventListener("click", () => {
    showCreateSupplierModal(fruit);
  });

  document.getElementById("saveBtn")?.addEventListener("click", () => {
    saveSupplierEdits(fruit);
  });

  document.getElementById("cancelBtn")?.addEventListener("click", () => {
    cancelSupplierEdits(fruit);
  });

  document.querySelectorAll(".sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if (state.sortConfig.column === col) {
        state.sortConfig.direction =
          state.sortConfig.direction === "asc" ? "desc" : "asc";
      } else {
        state.sortConfig.column = col;
        state.sortConfig.direction = "asc";
      }
      document.getElementById("tabContent").innerHTML = renderSupplierTab(fruit);
      attachTabEvents(fruit);
    });
  });

  document.getElementById("supplierFilter")?.addEventListener("input", (e) => {
    state.supplierFilterRaw = e.target.value;
    state.supplierFilter = e.target.value.trim().toLowerCase().normalize("NFC");
    document.getElementById("tabContent").innerHTML = renderSupplierTab(fruit);
    attachTabEvents(fruit);

    const filterEl = document.getElementById("supplierFilter");
    if (filterEl) {
      filterEl.focus();
      const len = filterEl.value.length;
      filterEl.setSelectionRange(len, len);
    }
  });

  document.getElementById("clearSearchSupplier")?.addEventListener("click", () => {
    state.supplierFilter = "";
    state.supplierFilterRaw = "";
    document.getElementById("tabContent").innerHTML = renderSupplierTab(fruit);
    attachTabEvents(fruit);
    document.getElementById("supplierFilter")?.focus();
  });
}

// ─────────────────────────────────────────────
// SAVE / CANCEL LOGIC
// ─────────────────────────────────────────────

function saveSupplierEdits(fruit) {
  const fruitInState = getFruitById(fruit.id);
  if (!fruitInState) return;

  document.querySelectorAll(".supplier-row").forEach((row) => {
    const supId = row.dataset.id;
    const sup = fruitInState.suppliers.find((s) => s.id === supId);
    if (!sup) return;

    row.querySelectorAll(".cell-input").forEach((input) => {
      sup[input.dataset.field] = input.value;
    });
    row.classList.remove("dirty");
  });

  state.supplierEdits = {};
  saveFruitsToStorage();
  showToast("Changes saved successfully!", "success");
}

function cancelSupplierEdits(fruit) {
  state.supplierEdits = {};
  document.getElementById("tabContent").innerHTML = renderSupplierTab(fruit);
  attachTabEvents(fruit);
  showToast("Changes discarded.", "info");
}

// ─────────────────────────────────────────────
// SORT HELPERS
// ─────────────────────────────────────────────

function sortSupplierRows(rows) {
  if (!state.sortConfig.column) return rows;
  const { column, direction } = state.sortConfig;
  return [...rows].sort((a, b) => {
    const aVal = (a[column] || "").toString().toLowerCase();
    const bVal = (b[column] || "").toString().toLowerCase();
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

function getSortIcon(col) {
  if (state.sortConfig.column !== col) return "⇅";
  return state.sortConfig.direction === "asc" ? "↑" : "↓";
}

function columnLabel(col) {
  const labels = {
    supplierName: "Supplier Name",
    sinceWhen: "Since When",
    city: "City",
    contactPerson: "Contact Person",
    phone: "Phone",
  };
  return labels[col] || col;
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────

function showEmptyState() {
  document.getElementById("detailPanel").innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">
        <i class="fa-solid fa-apple-whole fa-2xl"></i>
      </div>
      <h3>Select a Fruit</h3>
      <p>Choose a fruit from the list on the left to view its details, supplier information, and more.</p>
    </div>
  `;
}

// ─────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────

function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

function getFruitById(id) {
  return state.fruits.find((f) => f.id === id);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─────────────────────────────────────────────
// BOOT HELPERS
// ─────────────────────────────────────────────

function createSupplierId() {
  return `s${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function createFruitId() {
  const ids = state.fruits.map((fruit) => Number(fruit.id) || 0);
  return (ids.length ? Math.max(...ids) : 0) + 1;
}

function createFallbackImagePath(fruitName) {
  const safeName = (fruitName || "Fruit").trim();
  return `https://via.placeholder.com/180x180/e8f5e9/2d6a4f?text=${encodeURIComponent(safeName[0] || "F")}`;
}

function normalizeImagePath(imagePath) {
  if (!imagePath) return imagePath;
  if (/^(https?:)?\/\//i.test(imagePath) || imagePath.startsWith("data:")) {
    return imagePath;
  }

  return imagePath.replace(/^(\.\.\/)+/, "");
}

document.addEventListener("DOMContentLoaded", init);
