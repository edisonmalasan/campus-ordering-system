# Postman Testing Guide - NaviBites API

## CONTENTS

1. [Setup Instructions](#setup-instructions)
2. [Base URL & Environment Variables](#base-url--environment-variables)
3. [Authentication](#authentication)
4. [Auth Endpoints](#auth-endpoints)
5. [Customer Endpoints](#customer-endpoints)
6. [Shop Endpoints](#shop-endpoints)
7. [Admin Endpoints](#admin-endpoints)
8. [Testing Workflow](#testing-workflow)

---

## Setup Instructions

### 1. Postman Environment Setup

Create a new Postman Environment called "NaviBites Local" with these variables:

| Variable          | Initial Value           | Current Value                             |
| ----------------- | ----------------------- | ----------------------------------------- |
| `base_url`        | `http://localhost:5000` | `http://localhost:5000`                   |
| `customer_token`  | (empty)                 | (will be set after login)                 |
| `shop_token`      | (empty)                 | (will be set after login)                 |
| `admin_token`     | (empty)                 | (will be set after login)                 |
| `customer_id`     | (empty)                 | (will be set after registration)          |
| `shop_id`         | (empty)                 | (will be set after registration)          |
| `order_id`        | (empty)                 | (will be set after creating order)        |
| `menu_id`         | (empty)                 | (will be set after creating menu item)    |
| `cart_item_id`    | (empty)                 | (will be set after adding to cart)        |
| `notification_id` | (empty)                 | (will be set after getting notifications) |

### 2. Collection Setup

Create a Postman Collection with these folders:

- **Auth** (Public endpoints)
- **Customer** (Protected - requires customer token)
- **Shop** (Protected - requires shop token)
- **Admin** (Protected - requires admin token)

---

## Base URL & Environment Variables

**Base URL:** `{{base_url}}`

**Note:** Replace `{{base_url}}` with your actual server URL. Default is `http://localhost:5000`

**Note:** Create .env file in root folder and paste this `PORT=5000` & `MONGO_URI=mongodb://admin:password123@localhost:27017/mydb?authSource=admin`

---

## Authentication

### Token Format

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {{customer_token}}
```

### How to Get Tokens

1. Register a user (customer/shop) OR login
2. Copy the `token` from the response
3. Set it in your environment variable
4. Use `{{customer_token}}` or `{{shop_token}}` in Authorization header

---

## Auth Endpoints

### 1. Register Customer

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/register/customer`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "department": "Engineering",
  "gender": "male"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "customer",
      "department": "Engineering",
      "gender": "male"
    }
  }
}
```

**Test Script (to save token):**

```javascript
if (pm.response.code === 201) {
  const jsonData = pm.response.json();
  pm.environment.set("customer_token", jsonData.data.token);
  pm.environment.set("customer_id", jsonData.data.user.id);
}
```

---

### 2. Register Shop

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/register/shop`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**

```json
{
  "name": "Shop Owner",
  "email": "shop@example.com",
  "password": "password123",
  "shop_name": "Delicious Food Shop",
  "contact_number": "+1234567890",
  "delivery_radius": 5,
  "delivery_fee": 2.5,
  "business_permit_url": "https://example.com/permit.pdf",
  "operating_hours": [
    {
      "day": "Monday",
      "open": "09:00",
      "close": "18:00",
      "isClosed": false
    },
    {
      "day": "Tuesday",
      "open": "09:00",
      "close": "18:00",
      "isClosed": false
    }
  ]
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Shop Owner",
      "email": "shop@example.com",
      "role": "shop",
      "shop_name": "Delicious Food Shop",
      "status": "pending"
    }
  }
}
```

**Test Script:**

```javascript
if (pm.response.code === 201) {
  const jsonData = pm.response.json();
  pm.environment.set("shop_token", jsonData.data.token);
  pm.environment.set("shop_id", jsonData.data.user.id);
}
```

---

### 3. Login

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

**Test Script:**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  const role = jsonData.data.user.role;
  if (role === "customer") {
    pm.environment.set("customer_token", jsonData.data.token);
    pm.environment.set("customer_id", jsonData.data.user.id);
  } else if (role === "shop") {
    pm.environment.set("shop_token", jsonData.data.token);
    pm.environment.set("shop_id", jsonData.data.user.id);
  } else if (role === "admin") {
    pm.environment.set("admin_token", jsonData.data.token);
  }
}
```

---

### 4. Logout

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/logout`  
**Headers:**

```
Authorization: Bearer {{customer_token}}
Content-Type: application/json
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Customer Endpoints

**All customer endpoints require:** `Authorization: Bearer {{customer_token}}`

### 1. Get Profile

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/profile`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "contact_number": null,
    "department": "Engineering",
    "gender": "male",
    "profile_photo_url": null,
    "status": "active"
  }
}
```

---

### 2. Update Profile

**Method:** `PUT`  
**URL:** `{{base_url}}/api/customer/profile`  
**Body (JSON):**

```json
{
  "name": "John Updated",
  "contact_number": "+1234567890",
  "profile_photo_url": "https://example.com/photo.jpg"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john.doe@example.com",
    "contact_number": "+1234567890",
    "profile_photo_url": "https://example.com/photo.jpg"
  }
}
```

---

### 3. Deactivate Account

**Method:** `PUT`  
**URL:** `{{base_url}}/api/customer/deactivate`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Account deactivated successfully"
  }
}
```

---

### 4. Get Available Shops

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/shops`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Shop Owner",
      "email": "shop@example.com",
      "shop_name": "Delicious Food Shop",
      "logo_url": null,
      "delivery_radius": 5,
      "delivery_fee": 2.50,
      "operating_hours": [...],
      "isTemporarilyClosed": false
    }
  ]
}
```

---

### 5. Get Shop Menu

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/shops/{{shop_id}}/menu`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "items_name": "Burger",
      "items_description": "Delicious burger",
      "items_price": 10.99,
      "photo_url": "https://example.com/burger.jpg",
      "preparation_time": 15,
      "items_category": "Main",
      "status": "available",
      "stock": 50
    }
  ]
}
```

---

### 6. Get Cart

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/cart`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "shop_id": {
      "_id": "507f1f77bcf86cd799439012",
      "shop_name": "Delicious Food Shop",
      "logo_url": null,
      "delivery_fee": 2.5
    },
    "items": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "menu_id": {
          "_id": "507f1f77bcf86cd799439013",
          "items_name": "Burger",
          "items_price": 10.99,
          "photo_url": "https://example.com/burger.jpg"
        },
        "quantity": 2,
        "subtotal": 21.98
      }
    ],
    "total_amount": 21.98
  }
}
```

**Test Script:**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  if (jsonData.data.items && jsonData.data.items.length > 0) {
    pm.environment.set("cart_item_id", jsonData.data.items[0]._id);
  }
}
```

---

### 7. Add to Cart

**Method:** `POST`  
**URL:** `{{base_url}}/api/customer/cart/add`  
**Body (JSON):**

```json
{
  "shop_id": "507f1f77bcf86cd799439012",
  "menu_id": "507f1f77bcf86cd799439013",
  "quantity": 2
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "shop_id": {...},
    "items": [...],
    "total_amount": 21.98
  }
}
```

---

### 8. Update Cart Item

**Method:** `PUT`  
**URL:** `{{base_url}}/api/customer/cart/update/{{cart_item_id}}`  
**Body (JSON):**

```json
{
  "quantity": 3
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total_amount": 32.97
  }
}
```

---

### 9. Remove Item from Cart

**Method:** `DELETE`  
**URL:** `{{base_url}}/api/customer/cart/remove/{{cart_item_id}}`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [],
    "total_amount": 0
  }
}
```

---

### 10. Place Order

**Method:** `POST`  
**URL:** `{{base_url}}/api/customer/orders`  
**Body (JSON):**

```json
{
  "delivery_address": "123 Main St, City, State 12345",
  "payment_method": "gcash",
  "gcash_reference": "GCASH123456789",
  "notes": "Please deliver to front door"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "customer_id": "507f1f77bcf86cd799439011",
    "shop_id": {...},
    "items": [...],
    "total_amount": 24.48,
    "delivery_fee": 2.50,
    "delivery_address": "123 Main St, City, State 12345",
    "payment_method": "gcash",
    "payment_status": "completed",
    "order_status": "pending",
    "gcash_reference": "GCASH123456789",
    "notes": "Please deliver to front door"
  }
}
```

**Test Script:**

```javascript
if (pm.response.code === 201) {
  const jsonData = pm.response.json();
  pm.environment.set("order_id", jsonData.data._id);
}
```

---

### 11. Get Order History

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/orders`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "customer_id": "507f1f77bcf86cd799439011",
      "shop_id": {...},
      "items": [...],
      "total_amount": 24.48,
      "order_status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 12. Get Order Details

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/orders/{{order_id}}`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "customer_id": "507f1f77bcf86cd799439011",
    "shop_id": {...},
    "items": [...],
    "total_amount": 24.48,
    "delivery_address": "123 Main St, City, State 12345",
    "payment_method": "gcash",
    "order_status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 13. Cancel Order

**Method:** `POST`  
**URL:** `{{base_url}}/api/customer/orders/{{order_id}}/cancel`

**Note:** Only works within 10 seconds of order creation

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "order_status": "cancelled"
  }
}
```

---

### 14. Get Notifications

**Method:** `GET`  
**URL:** `{{base_url}}/api/customer/notifications`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "user_id": "507f1f77bcf86cd799439011",
      "title": "Order Accepted",
      "message": "Your order #507f1f77bcf86cd799439015 has been accepted by the shop.",
      "type": "order",
      "is_read": false,
      "order_id": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Test Script:**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.length > 0) {
    pm.environment.set("notification_id", jsonData.data[0]._id);
  }
}
```

---

### 15. Mark Notification as Read

**Method:** `PUT`  
**URL:** `{{base_url}}/api/customer/notifications/{{notification_id}}/read`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "is_read": true
  }
}
```

---

## Shop Endpoints

**All shop endpoints require:** `Authorization: Bearer {{shop_token}}`

### 1. Get Shop Profile

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/profile`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Shop Owner",
    "email": "shop@example.com",
    "shop_name": "Delicious Food Shop",
    "logo_url": null,
    "delivery_radius": 5,
    "delivery_fee": 2.50,
    "operating_hours": [...],
    "status": "pending",
    "contact_number": "+1234567890",
    "isTemporarilyClosed": false
  }
}
```

---

### 2. Update Shop Profile

**Method:** `PUT`  
**URL:** `{{base_url}}/api/shop/profile`  
**Body (JSON):**

```json
{
  "shop_name": "Updated Shop Name",
  "delivery_fee": 3.0,
  "isTemporarilyClosed": false
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "shop_name": "Updated Shop Name",
    "delivery_fee": 3.0
  }
}
```

---

### 3. Get Shop Menu

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/menu`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "shop_id": "507f1f77bcf86cd799439012",
      "items_name": "Burger",
      "items_description": "Delicious burger",
      "items_price": 10.99,
      "photo_url": "https://example.com/burger.jpg",
      "preparation_time": 15,
      "items_category": "Main",
      "status": "available",
      "stock": 50
    }
  ]
}
```

**Test Script:**

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.length > 0) {
    pm.environment.set("menu_id", jsonData.data[0]._id);
  }
}
```

---

### 4. Add Menu Item

**Method:** `POST`  
**URL:** `{{base_url}}/api/shop/menu`  
**Body (JSON):**

```json
{
  "items_name": "Pizza",
  "items_description": "Delicious pizza with cheese",
  "items_price": 15.99,
  "photo_url": "https://example.com/pizza.jpg",
  "preparation_time": 20,
  "items_category": "Main",
  "status": "available",
  "stock": 30
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "shop_id": "507f1f77bcf86cd799439012",
    "items_name": "Pizza",
    "items_price": 15.99,
    "status": "available"
  }
}
```

---

### 5. Update Menu Item

**Method:** `PUT`  
**URL:** `{{base_url}}/api/shop/menu/{{menu_id}}`  
**Body (JSON):**

```json
{
  "items_price": 16.99,
  "status": "available",
  "stock": 25
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "items_price": 16.99,
    "stock": 25
  }
}
```

---

### 6. Delete Menu Item

**Method:** `DELETE`  
**URL:** `{{base_url}}/api/shop/menu/{{menu_id}}`

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

### 7. Get Shop Orders

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/orders`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "customer_id": {...},
      "shop_id": "507f1f77bcf86cd799439012",
      "items": [...],
      "total_amount": 24.48,
      "order_status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 8. Accept Order

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/shop/orders/{{order_id}}/accept`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "order_status": "accepted"
  }
}
```

---

### 9. Reject Order

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/shop/orders/{{order_id}}/reject`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "order_status": "cancelled"
  }
}
```

---

### 10. Update Order Status

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/shop/orders/{{order_id}}/status`  
**Body (JSON):**

```json
{
  "status": "preparing"
}
```

**Valid statuses:** `preparing`, `on_the_way`, `delivered`, `cancelled`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "order_status": "preparing"
  }
}
```

---

### 11. Cancel Order (Shop)

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/shop/orders/{{order_id}}/cancel`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "order_status": "cancelled"
  }
}
```

---

### 12. Get Daily Sales Report

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/reports/daily`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "date": "2024-01-01T00:00:00.000Z",
    "total_orders": 5,
    "total_revenue": 125.50,
    "orders": [...]
  }
}
```

---

### 13. Get Weekly Sales Report

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/reports/weekly`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2023-12-25T00:00:00.000Z",
      "end": "2024-01-01T00:00:00.000Z"
    },
    "total_orders": 35,
    "total_revenue": 850.75,
    "daily_breakdown": {
      "2024-01-01": {
        "orders": 5,
        "revenue": 125.5
      }
    }
  }
}
```

---

### 14. Get Shop Notifications

**Method:** `GET`  
**URL:** `{{base_url}}/api/shop/notifications`

**Expected Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "user_id": "507f1f77bcf86cd799439012",
      "title": "New Order",
      "message": "You have a new order #507f1f77bcf86cd799439015 from a customer.",
      "type": "order",
      "is_read": false,
      "order_id": {...}
    }
  ]
}
```

---

## Admin Endpoints

**All admin endpoints require:** `Authorization: Bearer {{admin_token}}`

**Note:** Admin user must be created manually in database with `role: "admin"` and `access_level: "admin"` or `"super admin"`

### 1. Get All Users

**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/users`

**Query Parameters (optional):**

- `role` - Filter by role (customer/shop)
- `status` - Filter by status (active/inactive)
- `search` - Search by name or email
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)

**Example:** `{{base_url}}/api/admin/users?role=customer&status=active&page=1&limit=10`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [...],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

### 2. Update User Status

**Method:** `PUT`  
**URL:** `{{base_url}}/api/admin/users/{{customer_id}}/status`  
**Body (JSON):**

```json
{
  "status": "inactive"
}
```

**Valid statuses:** `active`, `inactive`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "inactive"
  }
}
```

---

### 3. Get All Shops

**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/shops`

**Query Parameters (optional):**

- `status` - Filter by status (pending/verified/rejected)
- `search` - Search by shop_name, name, or email
- `page` - Page number
- `limit` - Items per page

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "shops": [...],
    "total": 20,
    "page": 1,
    "limit": 100
  }
}
```

---

### 4. Verify Shop

**Method:** `PUT`  
**URL:** `{{base_url}}/api/admin/shops/{{shop_id}}/verify`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "verified"
  }
}
```

---

### 5. Update Shop Status

**Method:** `PUT`  
**URL:** `{{base_url}}/api/admin/shops/{{shop_id}}/status`  
**Body (JSON):**

```json
{
  "status": "rejected"
}
```

**Valid statuses:** `pending`, `verified`, `rejected`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "rejected"
  }
}
```

---

### 6. Get All Orders

**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/orders`

**Query Parameters (optional):**

- `shop_id` - Filter by shop
- `customer_id` - Filter by customer
- `order_status` - Filter by order status
- `payment_status` - Filter by payment status
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `page` - Page number
- `limit` - Items per page

**Example:** `{{base_url}}/api/admin/orders?order_status=pending&startDate=2024-01-01&endDate=2024-01-31`

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 100,
    "page": 1,
    "limit": 100
  }
}
```

---

### 7. Get Platform Overview Report

**Method:** `GET`  
**URL:** `{{base_url}}/api/admin/reports/overview`

**Query Parameters (optional):**

- `startDate` - Start date (ISO format, default: 30 days ago)
- `endDate` - End date (ISO format, default: today)

**Expected Response (200):**

```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2023-12-01T00:00:00.000Z",
      "end": "2024-01-01T00:00:00.000Z"
    },
    "users": {
      "total": 150,
      "customers": 120,
      "shops": 30,
      "active_shops": 25,
      "pending_shops": 5
    },
    "orders": {
      "total": 500,
      "completed": 450,
      "cancelled": 50,
      "completion_rate": "90.00"
    },
    "revenue": {
      "total": 12500.50,
      "average_per_order": 25.00
    },
    "daily_breakdown": {...},
    "top_shops": [...]
  }
}
```

---

## Testing Workflow

### Complete Customer Flow

1. **Register Customer** → Save `customer_token` and `customer_id`
2. **Login** (optional, to verify)
3. **Get Available Shops** → Note a `shop_id`
4. **Get Shop Menu** → Note a `menu_id`
5. **Get Cart** (should be empty)
6. **Add to Cart** → Save `cart_item_id`
7. **Get Cart** (verify item added)
8. **Update Cart Item** (change quantity)
9. **Place Order** → Save `order_id`
10. **Get Order History** (verify order appears)
11. **Get Order Details** (verify order info)
12. **Get Notifications** → Save `notification_id`
13. **Mark Notification as Read**

### Complete Shop Flow

1. **Register Shop** → Save `shop_token` and `shop_id`
2. **Login** (optional)
3. **Get Shop Profile**
4. **Add Menu Item** → Save `menu_id`
5. **Get Shop Menu** (verify item added)
6. **Update Menu Item**
7. **Get Shop Orders** (wait for customer to place order)
8. **Accept Order** (use `order_id` from customer)
9. **Update Order Status** → `preparing` → `on_the_way` → `delivered`
10. **Get Daily Sales Report**
11. **Get Weekly Sales Report**
12. **Get Shop Notifications**

### Complete Admin Flow

1. **Login as Admin** → Save `admin_token`
2. **Get All Users**
3. **Get All Shops**
4. **Verify Shop** (change shop status to verified)
5. **Update User Status** (activate/deactivate users)
6. **Get All Orders**
7. **Get Platform Overview Report**

---

## Common Error Responses

### 401 Unauthorized

```json
{
  "error": "No token provided or invalid format"
}
```

**Solution:** Add `Authorization: Bearer {{token}}` header

### 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

**Solution:** Use correct token for the role (customer/shop/admin)

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Server error message"
}
```

---
