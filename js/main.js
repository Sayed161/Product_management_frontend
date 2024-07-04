document.addEventListener('DOMContentLoaded', () => {
    const usernameLink = document.getElementById('username-link');
    const username = localStorage.getItem('role'); // Retrieve the username from localStorage

    if (username) {
        usernameLink.textContent = username; // Update the text content of the link with the username
    } else {
        console.error('Username not found in localStorage');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('product-table-body');
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    
    fetch('http://127.0.0.1:8000/products/', {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Function to update table rows based on data
        const updateTableRows = (products) => {
            tableBody.innerHTML = ''; // Clear previous rows
            products.forEach((product) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.Product_name}</td>
                    <td>${product.SKU}</td>
                    <td>${product.Category}</td>
                    <td>${product.Brand}</td>
                    <td>${product.price}$</td>
                    <td>${product.Unit}</td>
                    <td>${product.Quantity}</td>
                    <td>${product.Created_by}</td>
                    <td>
                        <a href="edit_products.html?id=${product.id}">Edit</a> 
                        <a href="#" onclick="deleteProduct(${product.id})">Delete</a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        };

        updateTableRows(data);
  
        searchInput.addEventListener('keyup', function() {
            const searchValue = this.value.toLowerCase();
            const categoryFilter = filterCategory.value.toLowerCase();
            
            const filteredProducts = data.filter(product => {
                const matchesSearch = (
                    product.Product_name.toLowerCase().includes(searchValue) ||
                    product.SKU.toLowerCase().includes(searchValue) ||
                    product.Category.toLowerCase().includes(searchValue) ||
                    product.Brand.toLowerCase().includes(searchValue)
                );
                
                const matchesCategory = (
                    categoryFilter === "" || product.Category.toLowerCase() === categoryFilter
                );
                
                return matchesSearch && matchesCategory;
            });
            
            updateTableRows(filteredProducts);
        });
        
    
        filterCategory.addEventListener('change', function() {
            const searchValue = searchInput.value.toLowerCase();
            const categoryFilter = this.value.toLowerCase();
            
            const filteredProducts = data.filter(product => {
                const matchesSearch = (
                    product.Product_name.toLowerCase().includes(searchValue) ||
                    product.SKU.toLowerCase().includes(searchValue) ||
                    product.Category.toLowerCase().includes(searchValue) ||
                    product.Brand.toLowerCase().includes(searchValue)
                );
                
                const matchesCategory = (
                    categoryFilter === "" || product.Category.toLowerCase() === categoryFilter
                );
                
                return matchesSearch && matchesCategory;
            });
            
            updateTableRows(filteredProducts);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
       
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProductForm');
    form.addEventListener('submit', handleProduct);
});

async function handleProduct(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target;
    const token = localStorage.getItem('token'); // Make sure 'token' is defined and contains the auth token

    const productname = form.Product_name.value;
    const category = form.Category.value;
    const subCategory = form.SubCategory.value;
    const brand = form.Brand.value;
    const unit = form.Unit.value;
    const sku = form.SKU.value;
    const min_qty = form.Minimum_Quantity.value;
    const qty = form.Quantity.value;
    const Desc = form.Description.value;
    const tax = form.Tax.value;
    const dics = form.Discount.value;
    const Price = form.price.value;
    const status = form.Status.value;
    const created = form.Created_By.value;
    const product_image = form.product_image.files[0];

    const formData = new FormData();
    formData.append('Product_name', productname);
    formData.append('Category', category);
    formData.append('SubCategory', subCategory);
    formData.append('Brand', brand);
    formData.append('Unit', unit);
    formData.append('SKU', sku);
    formData.append('Minimum_Quantity', min_qty);
    formData.append('Quantity', qty);
    formData.append('Description', Desc);
    formData.append('Tax', tax);
    formData.append('Discount', dics);
    formData.append('price', Price);
    formData.append('Status', status);
    formData.append('product_image', product_image);
    formData.append('Created_by', created);

    try {
        const response = await fetch('http://127.0.0.1:8000/products/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Product added successfully:', result);
                window.location.href = "add_products.html"; // Redirect to success page or handle success message
            } else {
                console.log('Product added successfully, non-JSON response:', response);
                window.location.href = "add_products.html"; // Redirect to success page or handle success message
            }
        } else {
            const errorText = await response.text();
            console.error('Product addition failed:', errorText);
            alert('Product addition failed: ' + errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error: ' + error.message);
    }
}

async function deleteProduct(productId) {
    const token = localStorage.getItem('token');

    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Product deleted successfully');
            window.location.reload(); // Reload the page to update the list
        } else {
            const errorText = await response.text();
            console.error('Product deletion failed:', errorText);
            alert('Product deletion failed: ' + errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error: ' + error.message);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
       
        window.location.href = 'login.html';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Assuming you store user role in localStorage


    const listProductsLink = document.querySelector('a[href="list_products.html"]');

    if (!token) {
       
        window.location.href = 'login.html'; 
    }
    if (userRole !== 'admin' && listProductsLink) {
        listProductsLink.parentElement.style.display = 'none'; // Hide the list products link
    }
});


$(document).ready(function() {
    // Search and Filter Functionality
    $('#searchInput').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('#product-table-body tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('#filterCategory').on('change', function() {
        var category = $(this).val().toLowerCase();
        $('#product-table-body tr').filter(function() {
            var rowCategory = $(this).find('td:eq(3)').text().toLowerCase(); // Replace 3 with the column index of Category
            $(this).toggle(category === "" || rowCategory.indexOf(category) > -1);
        });
    });
});
