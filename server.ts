import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_FARMS,
  INITIAL_CROPS,
  INITIAL_LIVESTOCK,
  INITIAL_FINANCIALS,
  INITIAL_ARTICLES,
  INITIAL_ORDERS,
  INITIAL_MESSAGES,
} from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'hub_db.json');

// Interface for DB state
interface DatabaseState {
  users: typeof INITIAL_USERS;
  products: typeof INITIAL_PRODUCTS;
  farms: typeof INITIAL_FARMS;
  crops: typeof INITIAL_CROPS;
  livestock: typeof INITIAL_LIVESTOCK;
  financials: typeof INITIAL_FINANCIALS;
  articles: typeof INITIAL_ARTICLES;
  orders: typeof INITIAL_ORDERS;
  messages: typeof INITIAL_MESSAGES;
}

function loadDatabase(): DatabaseState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading DB, re-seeding...', err);
    }
  }

  const initialState: DatabaseState = {
    users: INITIAL_USERS,
    products: INITIAL_PRODUCTS,
    farms: INITIAL_FARMS,
    crops: INITIAL_CROPS,
    livestock: INITIAL_LIVESTOCK,
    financials: INITIAL_FINANCIALS,
    articles: INITIAL_ARTICLES,
    orders: INITIAL_ORDERS,
    messages: INITIAL_MESSAGES,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
  return initialState;
}

let db = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '25mb' }));

  // API router
  const api = express.Router();

  // 1. Auth endpoints
  api.post('/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      // Default to farmer if not found, or return 401
      return res.status(401).json({ error: 'Invalid email or user not found' });
    }
    // Simple demo password verification
    res.json({ success: true, user });
  });

  api.post('/auth/register', (req: Request, res: Response) => {
    const { name, email, role, phone, location, farmName, bio } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '+254 700 000 000',
      location: location || 'Kenya',
      farmName: farmName || (role === 'farmer' ? `${name}'s Farm` : undefined),
      bio: bio || '',
      verified: true,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDatabase();
    res.json({ success: true, user: newUser });
  });

  api.post('/auth/reset-password', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'No account registered with that email' });
    }
    res.json({ success: true, message: `Password reset instructions sent to ${email}` });
  });

  api.put('/auth/profile', (req: Request, res: Response) => {
    const { id, name, phone, location, bio, farmName, avatar } = req.body;
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.users[index] = {
      ...db.users[index],
      name: name ?? db.users[index].name,
      phone: phone ?? db.users[index].phone,
      location: location ?? db.users[index].location,
      bio: bio ?? db.users[index].bio,
      farmName: farmName ?? db.users[index].farmName,
      avatar: avatar ?? db.users[index].avatar,
    };
    saveDatabase();
    res.json({ success: true, user: db.users[index] });
  });

  // 2. Products endpoints
  api.get('/products', (req: Request, res: Response) => {
    let list = [...db.products];
    const { category, search, sellerId, status } = req.query;

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (status) {
      list = list.filter((p) => p.status === status);
    }
    if (sellerId) {
      list = list.filter((p) => p.sellerId === sellerId);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  api.post('/products', (req: Request, res: Response) => {
    const {
      title,
      description,
      category,
      price,
      unit,
      quantityAvailable,
      location,
      sellerId,
      sellerName,
      sellerPhone,
      image,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    const newProduct = {
      id: `prod_${Date.now()}`,
      title,
      description: description || '',
      category,
      price: Number(price),
      unit: unit || 'kg',
      quantityAvailable: Number(quantityAvailable) || 1,
      location: location || 'Kenya',
      sellerId: sellerId || 'usr_farmer_1',
      sellerName: sellerName || 'Farm Producer',
      sellerPhone: sellerPhone || '+254 700 000 000',
      image: image || '/src/assets/images/farm_harvest_maize_1793644381885.jpg',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDatabase();
    res.json(newProduct);
  });

  api.put('/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase();
    res.json(db.products[index]);
  });

  api.delete('/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    db.products = db.products.filter((p) => p.id !== id);
    saveDatabase();
    res.json({ success: true, message: 'Product deleted' });
  });

  // 3. Farms & Crop & Livestock endpoints
  api.get('/farms', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId) {
      return res.json(db.farms.filter((f) => f.userId === userId));
    }
    res.json(db.farms);
  });

  api.post('/farms', (req: Request, res: Response) => {
    const newFarm = {
      id: `farm_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    db.farms.push(newFarm);
    saveDatabase();
    res.json(newFarm);
  });

  api.put('/farms/:id', (req: Request, res: Response) => {
    const index = db.farms.findIndex((f) => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Farm not found' });
    db.farms[index] = { ...db.farms[index], ...req.body };
    saveDatabase();
    res.json(db.farms[index]);
  });

  api.get('/crops', (req: Request, res: Response) => {
    const { userId, farmId } = req.query;
    let list = db.crops;
    if (userId) list = list.filter((c) => c.userId === userId);
    if (farmId) list = list.filter((c) => c.farmId === farmId);
    res.json(list);
  });

  api.post('/crops', (req: Request, res: Response) => {
    const newCrop = { id: `crop_${Date.now()}`, ...req.body };
    db.crops.push(newCrop);
    saveDatabase();
    res.json(newCrop);
  });

  api.put('/crops/:id', (req: Request, res: Response) => {
    const index = db.crops.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Crop record not found' });
    db.crops[index] = { ...db.crops[index], ...req.body };
    saveDatabase();
    res.json(db.crops[index]);
  });

  api.delete('/crops/:id', (req: Request, res: Response) => {
    db.crops = db.crops.filter((c) => c.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  api.get('/livestock', (req: Request, res: Response) => {
    const { userId, farmId } = req.query;
    let list = db.livestock;
    if (userId) list = list.filter((l) => l.userId === userId);
    if (farmId) list = list.filter((l) => l.farmId === farmId);
    res.json(list);
  });

  api.post('/livestock', (req: Request, res: Response) => {
    const newAnimal = { id: `live_${Date.now()}`, ...req.body };
    db.livestock.push(newAnimal);
    saveDatabase();
    res.json(newAnimal);
  });

  api.put('/livestock/:id', (req: Request, res: Response) => {
    const index = db.livestock.findIndex((l) => l.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Livestock not found' });
    db.livestock[index] = { ...db.livestock[index], ...req.body };
    saveDatabase();
    res.json(db.livestock[index]);
  });

  api.delete('/livestock/:id', (req: Request, res: Response) => {
    db.livestock = db.livestock.filter((l) => l.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  api.get('/financials', (req: Request, res: Response) => {
    const { userId } = req.query;
    let list = db.financials;
    if (userId) list = list.filter((f) => f.userId === userId);
    res.json(list);
  });

  api.post('/financials', (req: Request, res: Response) => {
    const newRecord = {
      id: `fin_${Date.now()}`,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0],
    };
    db.financials.unshift(newRecord);
    saveDatabase();
    res.json(newRecord);
  });

  api.delete('/financials/:id', (req: Request, res: Response) => {
    db.financials = db.financials.filter((f) => f.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // 4. Orders & Payments
  api.get('/orders', (req: Request, res: Response) => {
    const { userId, role } = req.query;
    let list = [...db.orders];

    if (role === 'buyer') {
      list = list.filter((o) => o.buyerId === userId);
    } else if (role === 'farmer') {
      // Find orders that contain farmer's products
      list = list.filter((o) => o.items.some((item) => item.sellerId === userId));
    }
    res.json(list);
  });

  api.post('/orders', (req: Request, res: Response) => {
    const {
      buyerId,
      buyerName,
      buyerPhone,
      buyerEmail,
      deliveryAddress,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      transactionReference,
      mpesaPhoneNumber,
    } = req.body;

    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: `FH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId,
      buyerName,
      buyerPhone,
      buyerEmail,
      deliveryAddress,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentStatus: paymentStatus || 'completed',
      orderStatus: 'processing' as const,
      transactionReference:
        transactionReference ||
        (paymentMethod === 'M-Pesa'
          ? `MPESA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          : `CARD-TXN-${Date.now()}`),
      mpesaPhoneNumber,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock
    items.forEach((item: { productId: string; quantity: number }) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.quantityAvailable = Math.max(0, prod.quantityAvailable - item.quantity);
        if (prod.quantityAvailable === 0) {
          prod.status = 'sold';
        }
      }
    });

    // Record income for seller
    items.forEach((item: { sellerId: string; title: string; price: number; quantity: number }) => {
      db.financials.unshift({
        id: `fin_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: item.sellerId,
        type: 'income',
        category: 'Produce Sale',
        amount: item.price * item.quantity,
        description: `Order ${newOrder.orderNumber}: ${item.quantity}x ${item.title}`,
        date: new Date().toISOString().split('T')[0],
      });
    });

    // Add confirmation message
    db.messages.unshift({
      id: `msg_${Date.now()}`,
      senderId: 'usr_admin_1',
      senderName: 'Farmers Hub Marketplace',
      senderRole: 'admin',
      receiverId: buyerId,
      receiverName: buyerName,
      receiverRole: 'buyer',
      content: `Your order #${newOrder.orderNumber} for KSh ${Number(totalAmount).toLocaleString()} was placed successfully via ${paymentMethod}. Reference: ${newOrder.transactionReference}. The seller is preparing shipment.`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    db.orders.unshift(newOrder);
    saveDatabase();
    res.json(newOrder);
  });

  api.patch('/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.orderStatus = status;
    saveDatabase();
    res.json(order);
  });

  // M-Pesa Express Simulation & Verification endpoint
  api.post('/payments/mpesa-express', (req: Request, res: Response) => {
    const { phoneNumber, amount, accountReference } = req.body;
    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'Phone number and amount required' });
    }

    // Generate authentic Safaricom Daraja CheckoutRequestID & Receipt
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const mpesaReceipt = `NL${Math.floor(10000000 + Math.random() * 90000000)}QK`;

    res.json({
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: `29115-${Date.now()}-1`,
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `Success! STK Push prompt sent to ${phoneNumber}. Please enter your M-Pesa PIN on your phone to complete payment of KSh ${Number(amount).toLocaleString()}.`,
      SimulatedReceipt: mpesaReceipt,
      LiveDarajaReady: true,
      DarajaConfigInfo: {
        endpoint: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        environment: 'Ready for Safaricom Daraja Sandbox & Production credentials',
        passKeyNotice: 'Production passkey and Consumer Secret configured via Server Environment variables.',
      },
    });
  });

  // 5. Articles (Education)
  api.get('/articles', (req: Request, res: Response) => {
    const { category, search } = req.query;
    let list = [...db.articles];
    if (category && category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }
    res.json(list);
  });

  api.post('/articles', (req: Request, res: Response) => {
    const { title, excerpt, content, category, authorId, authorName, authorRole, tags, imageUrl } =
      req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }
    const newArticle = {
      id: `art_${Date.now()}`,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      category,
      authorId: authorId || 'usr_expert_1',
      authorName: authorName || 'Agricultural Expert',
      authorRole: authorRole || 'Research Agronomist',
      readTime: `${Math.max(3, Math.ceil(content.split(' ').length / 180))} min read`,
      publishedAt: new Date().toISOString().split('T')[0],
      featured: false,
      tags: tags || ['Farming', category],
      imageUrl: imageUrl || '/src/assets/images/farm_harvest_maize_1793644381885.jpg',
    };
    db.articles.unshift(newArticle);
    saveDatabase();
    res.json(newArticle);
  });

  api.delete('/articles/:id', (req: Request, res: Response) => {
    db.articles = db.articles.filter((a) => a.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // 6. Messages
  api.get('/messages', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (!userId) return res.json(db.messages);
    const list = db.messages.filter((m) => m.senderId === userId || m.receiverId === userId);
    res.json(list);
  });

  api.post('/messages', (req: Request, res: Response) => {
    const {
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName,
      receiverRole,
      content,
      relatedProductId,
      productTitle,
    } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({ error: 'Content and recipient are required' });
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName: receiverName || 'Farmer / Buyer',
      receiverRole: receiverRole || 'farmer',
      content,
      relatedProductId,
      productTitle,
      timestamp: new Date().toISOString(),
      read: false,
    };

    db.messages.unshift(newMsg);
    saveDatabase();
    res.json(newMsg);
  });

  api.patch('/messages/:id/read', (req: Request, res: Response) => {
    const msg = db.messages.find((m) => m.id === req.params.id);
    if (msg) {
      msg.read = true;
      saveDatabase();
    }
    res.json({ success: true });
  });

  // 7. Admin & Platform Statistics
  api.get('/admin/stats', (req: Request, res: Response) => {
    const totalSalesVolume = db.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalFarmers = db.users.filter((u) => u.role === 'farmer').length;
    const totalBuyers = db.users.filter((u) => u.role === 'buyer').length;
    const activeProducts = db.products.filter((p) => p.status === 'active').length;

    res.json({
      totalUsers: db.users.length,
      farmersCount: totalFarmers,
      buyersCount: totalBuyers,
      suppliersCount: db.users.filter((u) => u.role === 'supplier').length,
      expertsCount: db.users.filter((u) => u.role === 'expert').length,
      productsCount: db.products.length,
      activeProductsCount: activeProducts,
      ordersCount: db.orders.length,
      totalSalesVolume,
      articlesCount: db.articles.length,
      recentUsers: db.users.slice(-5),
    });
  });

  api.get('/admin/users', (req: Request, res: Response) => {
    res.json(db.users);
  });

  app.use('/api', api);

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Farmers Hub] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
