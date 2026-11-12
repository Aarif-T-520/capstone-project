document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    initDefaultProducts();
    loadProducts();
    updateCartUI();
});

// Authentication Simulation
function loginUser() {
    const username = document.getElementById('username-input').value.trim();
    if (username) {
        localStorage.setItem('capstone_user', username);
        checkLogin();
    } else {
        alert("Please enter your name!");
    }
}

function logoutUser() {
    localStorage.removeItem('capstone_user');
    checkLogin();
}

function checkLogin() {
    const user = localStorage.getItem('capstone_user');
    if (user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        document.getElementById('welcome-msg').innerText = `Welcome, ${user}`;
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app-screen').style.display = 'none';
    }
}

// 12 Default Products with Photos
function initDefaultProducts() {
    let products = JSON.parse(localStorage.getItem('products_v2'));
    if (!products || products.length === 0) {
        const defaultItems = [
            { id: 1, name: "Casual Cotton Shirt", price: "899", category: "Shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80" },
            { id: 2, name: "Formal Slim-Fit Pant", price: "1299", category: "Pant", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80" },
            { id: 3, name: "Classic Winter Coat", price: "3499", category: "Coat", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80" },
            { id: 4, name: "Designer Waistcoat", price: "1799", category: "Waistcoat", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80" },
            { id: 5, name: "Party Wear Dress", price: "2499", category: "Dress", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80" },
            { id: 6, name: "Graphic Printed T-Shirt", price: "599", category: "T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80" },
            { id: 7, name: "Royal Jodhpuri Jacket", price: "4599", category: "Jodhpuri", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&q=80" },
            { id: 8, name: "Formal Tailored Blazer", price: "3999", category: "Coat", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80" },
            { id: 9, name: "Denim Jeans Pant", price: "1499", category: "Pant", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
            { id: 10, name: "Ethnic Festive Dress", price: "1999", category: "Dress", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80" },
            { id: 11, name: "Polo Collar T-Shirt", price: "799", category: "T-Shirt", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80" },
            { id: 12, name: "Wedding Jodhpuri Suit", price: "5999", category: "Jodhpuri", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80" }
        ];
        localStorage.setItem('products_v2', JSON.stringify(defaultItems));
    }
}

// CRUD Operations
const productForm = document.getElementById('product-form');
const prodNameInput = document.getElementById('prod-name');
const prodPriceInput = document.getElementById('prod-price');
const prodCategoryInput = document.getElementById('prod-category');
const prodImageInput = document.getElementById('prod-image');
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');
const productList = document.getElementById('product-list');

const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80";

productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = prodNameInput.value.trim();
    const price = prodPriceInput.value.trim();
    const category = prodCategoryInput.value.trim();
    const image = prodImageInput.value.trim() || DEFAULT_FALLBACK_IMG;
    const editId = editIdInput.value;

    let products = getProducts();

    if (editId) {
        products = products.map(prod => {
            if (prod.id == editId) {
                return { id: prod.id, name, price, category, image };
            }
            return prod;
        });
        editIdInput.value = '';
        submitBtn.innerText = 'Add Product';
        formTitle.innerText = '➕ Add New Outfit / Product';
    } else {
        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            image
        };
        products.unshift(newProduct); // Naya product sabse upar dikhega
    }

    localStorage.setItem('products_v2', JSON.stringify(products));
    productForm.reset();
    loadProducts();
});

function getProducts() {
    return JSON.parse(localStorage.getItem('products_v2')) || [];
}

function loadProducts(filterText = '') {
    productList.innerHTML = '';
    const products = getProducts();

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(filterText.toLowerCase()) || 
        p.category.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
        productList.innerHTML = '<p style="color:#718096; grid-column: 1/-1; text-align:center;">No outfits found matching your search.</p>';
        return;
    }

    filtered.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}" class="product-img" onerror="this.src='${DEFAULT_FALLBACK_IMG}'">
            <div class="card-body">
                <span class="category-badge">${prod.category}</span>
                <h3>${prod.name}</h3>
                <p class="price-tag">₹${prod.price}</p>
                <div class="card-buttons">
                    <button onclick="addToCart('${prod.name}')">🛒 Add to Cart</button>
                    <div class="action-row">
                        <button class="edit-btn" onclick="editProduct(${prod.id})">✏️ Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${prod.id})">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(card);
    });
}

function editProduct(id) {
    const products = getProducts();
    const prod = products.find(p => p.id === id);
    if (prod) {
        prodNameInput.value = prod.name;
        prodPriceInput.value = prod.price;
        prodCategoryInput.value = prod.category;
        prodImageInput.value = prod.image;
        editIdInput.value = prod.id;
        submitBtn.innerText = 'Update Product';
        formTitle.innerText = '✏️ Edit Outfit';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(prod => prod.id !== id);
    localStorage.setItem('products_v2', JSON.stringify(products));
    loadProducts();
}

function searchProducts() {
    const query = document.getElementById('search-input').value;
    loadProducts(query);
}

// Cart Management
function addToCart(productName) {
    let count = parseInt(localStorage.getItem('capstone_cart')) || 0;
    count++;
    localStorage.setItem('capstone_cart', count);
    updateCartUI();
    alert(`"${productName}" added to cart! 🛒`);
}

function updateCartUI() {
    let count = parseInt(localStorage.getItem('capstone_cart')) || 0;
    document.getElementById('cart-count').innerText = count;
}