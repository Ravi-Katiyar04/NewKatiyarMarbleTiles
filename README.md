# Katiyar Marble & Tiles

Full-stack e-commerce web application for browsing marble and tile products, placing bookings (orders), managing enquiries, and running a seller admin dashboard.

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend  | Node.js, Express 5, MongoDB (Mongoose)     |
| Services | Cloudinary (images), Stripe (online payments) |

---

## Features

**Storefront**

- Product catalog with categories, search, and product detail pages
- Shopping cart and checkout (Cash on Delivery or Stripe deposit)
- Saved delivery addresses
- **My Orders** — view bookings and quote enquiries in one place
- In-app notifications
- “Get a Quote” enquiry form (works for guests and logged-in users)

**Seller dashboard** (`/seller`)

- Add and manage products (with image uploads via Cloudinary)
- View and update order/booking status
- Respond to customer enquiries

---

## Prerequisites

Install before you begin:

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- [npm](https://www.npmjs.com/) (included with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB instance)
- [Cloudinary](https://cloudinary.com/) account (product images)
- [Stripe](https://stripe.com/) account (optional — only needed for card/deposit checkout)

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd NewKatiyarMarbleTiles

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Create **`backend/.env`**:

```env
# Server (default in code is 4000 if unset)
PORT=5000

# MongoDB — Atlas SRV connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Optional: comma-separated DNS servers (helps on some Windows networks)
MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8

# Optional: non-SRV URI if SRV/DNS fails locally
# MONGODB_URI_STANDARD=mongodb://user:pass@host1:27017,host2:27017/db?ssl=true&authSource=admin
# MONGODB_DBNAME=QuickBasket

JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (optional for local COD-only testing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Seller dashboard login
SELLER_EMAIL=admin@example.com
SELLER_PASSWORD=your_secure_password
```

Create **`frontend/.env`** (must match backend `PORT`):

```env
VITE_BASE_URL=http://localhost:5000
VITE_CURRENCY=₹
```

> **Important:** `VITE_BASE_URL` must point to the same host and port as your running API. If you omit `PORT` in the backend, the server uses **4000** — then set `VITE_BASE_URL=http://localhost:4000` instead.

### 3. Run the app

Use **two terminals**.

**Terminal 1 — API**

```bash
cd backend
node server.js
```

For auto-restart during development:

```bash
npx nodemon server.js
```

**Terminal 2 — UI**

```bash
cd frontend
npm run dev
```

| Service  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:5000      |

Open the frontend URL in your browser. Register a customer account to place orders; use `/seller` with `SELLER_EMAIL` / `SELLER_PASSWORD` for the admin panel.

---

## Project structure

```
NewKatiyarMarbleTiles/
├── backend/
│   ├── configs/          # DB, Cloudinary, Multer
│   ├── controllers/
│   ├── middlewares/      # authUser, authSeller
│   ├── models/
│   ├── routes/
│   └── server.js         # Entry point
└── frontend/
    └── src/
        ├── components/
        ├── context/      # AppContext (axios, auth, cart)
        └── pages/        # Routes and seller views
```

---

## Frontend routes

| Path | Description |
| ---- | ----------- |
| `/` | Home |
| `/products`, `/products/:category`, `/products/:category/:id` | Catalog & product detail |
| `/cart` | Cart |
| `/add-address` | Delivery addresses |
| `/my-orders` | Bookings & enquiries list |
| `/my-orders/booking/:id` | Booking detail & receipt |
| `/my-orders/enquiry/:id` | Enquiry detail & seller response |
| `/notifications` | User notifications |
| `/seller` | Seller login & dashboard |
| `/contact`, `/about`, `/blog`, `/applications` | Marketing pages |

---

## API overview

Base URL: `http://localhost:<PORT>` (cookies used for auth — enable `credentials` on the client; already configured in `AppContext`).

### Users — `/api/users`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/register` | — | Register |
| POST | `/login` | — | Login |
| GET | `/logout` | User | Logout |
| GET | `/is-authenticated` | User | Session check |

### Products — `/api/product`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/list` | — | All products |
| GET | `/id` | — | Product by query `id` |
| POST | `/add` | Seller | Add product (multipart images) |
| POST | `/stock` | Seller | Update `inStock` |

### Cart & addresses

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/cart/update` | User | Sync cart |
| POST | `/api/address/add` | User | Add address |
| GET | `/api/address/get` | User | List addresses |

### Orders (bookings) — `/api/order`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/cod` | User | Place COD order |
| POST | `/stripe` | User | Start Stripe checkout |
| GET | `/user` | User | List user orders |
| GET | `/user/:id` | User | Order detail |
| GET | `/:id/receipt` | User | Receipt data |
| GET | `/seller` | Seller | All orders |
| PUT | `/:id/status` | Seller | Confirm / reject booking |

Stripe webhook (production): `POST /stripe` with raw body — configure `STRIPE_WEBHOOK_SECRET`.

### Enquiries — `/api/enquiry`

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/` | — | Submit quote enquiry |
| GET | `/user` | User | My enquiries |
| GET | `/user/:id` | User | Enquiry detail |
| GET | `/seller` | Seller | All enquiries |
| PUT | `/:id/respond` | Seller | Reply to enquiry |

### Seller & notifications

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/seller/login` | — | Seller login |
| GET | `/api/seller/is-auth` | Seller | Session check |
| GET | `/api/seller/logout` | Seller | Logout |
| GET | `/api/notification/user` | User | Notifications |
| PUT | `/api/notification/read-all` | User | Mark all read |

---

## Production build

**Frontend**

```bash
cd frontend
npm run build
npm run preview   # optional local preview of dist/
```

**Backend**

Deploy `backend/` with `node server.js`. Set `NODE_ENV=production`, secure secrets, and add your deployed frontend origin to `allowedOrigins` in `backend/server.js`.

---

## Troubleshooting

| Issue | What to try |
| ----- | ----------- |
| API calls fail / empty data | Confirm backend is running and `VITE_BASE_URL` matches `PORT`. Restart Vite after changing `.env`. |
| MongoDB connection errors on Windows | Set `MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8` or use `MONGODB_URI_STANDARD` with a standard `mongodb://` URI. |
| Images not uploading | Verify Cloudinary credentials in `backend/.env`. |
| Stripe checkout fails | Check `STRIPE_SECRET_KEY`; webhook secret only needed for payment confirmation webhooks. |
| **My Orders** shows nothing | Log in with the same account used to place orders or submit enquiries; both require authentication for linked history. |

---

## Scripts reference

| Location | Command | Purpose |
| -------- | ------- | ------- |
| `backend/` | `node server.js` | Start API |
| `backend/` | `npx nodemon server.js` | API with hot reload |
| `backend/` | `npm run migrate:sanitary` | One-off category migration script |
| `frontend/` | `npm run dev` | Development server |
| `frontend/` | `npm run build` | Production bundle |
| `frontend/` | `npm run lint` | ESLint |

---

## License

Private / internal use unless otherwise specified by the repository owner.
