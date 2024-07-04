document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const token = localStorage.getItem('token');

    if (!productId || !token) {
        console.error('Product ID or token not found.');
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (response.ok) {
            const product = await response.json();
            document.getElementById('Product_name').value = product.Product_name;
            document.getElementById('Category').value = product.Category;
            document.getElementById('SubCategory').value = product.SubCategory;
            document.getElementById('Brand').value = product.Brand;
            document.getElementById('Unit').value = product.Unit;
            document.getElementById('SKU').value = product.SKU;
            document.getElementById('Minimum_Quantity').value = product.Minimum_Quantity;
            document.getElementById('Quantity').value = product.Quantity;
            document.getElementById('Description').value = product.Description;
            document.getElementById('Tax').value = product.Tax;
            document.getElementById('Discount').value = product.Discount;
            document.getElementById('price').value = product.price;
            document.getElementById('Status').value = product.Status;
            document.getElementById('Created_By').value = product.Created_by;
        } else {
            console.error('Failed to fetch product:', response.statusText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
});


document.getElementById('editProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const form = event.target;
    const productId = urlParams.get('id');
    const token = localStorage.getItem('token');

    const formData = new FormData(form);

    try {
        const response = await fetch(`http://127.0.0.1:8000/products/${productId}/`, {
            method: 'PUT', 
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Product updated successfully:', result);
            window.location.href = "list_products.html"; // Redirect to the list page
        } else {
            const errorText = await response.text();
            console.error('Product update failed:', errorText);
            alert('Product update failed: ' + errorText);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error: ' + error.message);
    }
});
