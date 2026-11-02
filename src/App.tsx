import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Marketplace } from './components/Marketplace.tsx';
import { FarmerDashboard } from './components/FarmerDashboard.tsx';
import { FarmManager } from './components/FarmManager.tsx';
import { WeatherWidget } from './components/WeatherWidget.tsx';
import { EducationCenter } from './components/EducationCenter.tsx';
import { MessagingCenter } from './components/MessagingCenter.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { SupportPages } from './components/SupportPages.tsx';
import { Footer } from './components/Footer.tsx';
import { api } from './services/api.ts';
import {
  Product,
  Order,
  CropRecord,
  LivestockRecord,
  FinancialRecord,
  Article,
  Message,
  Farm,
} from './types/index.ts';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CROPS,
  INITIAL_LIVESTOCK,
  INITIAL_FINANCIALS,
  INITIAL_ARTICLES,
  INITIAL_MESSAGES,
  INITIAL_FARMS,
} from './data/initialData.ts';

function MainContent() {
  const { currentUser, switchAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // App dataset states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [crops, setCrops] = useState<CropRecord[]>(INITIAL_CROPS);
  const [livestock, setLivestock] = useState<LivestockRecord[]>(INITIAL_LIVESTOCK);
  const [financials, setFinancials] = useState<FinancialRecord[]>(INITIAL_FINANCIALS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);

  // Load initial data from Express backend
  useEffect(() => {
    async function initData() {
      try {
        const [p, o, c, l, f, a, m, fm] = await Promise.allSettled([
          api.getProducts(),
          api.getOrders(),
          api.getCrops(),
          api.getLivestock(),
          api.getFinancials(),
          api.getArticles(),
          api.getMessages(currentUser?.id || 'usr_farmer_1'),
          api.getFarms(),
        ]);

        if (p.status === 'fulfilled' && p.value?.length) setProducts(p.value);
        if (o.status === 'fulfilled' && o.value?.length) setOrders(o.value);
        if (c.status === 'fulfilled' && c.value?.length) setCrops(c.value);
        if (l.status === 'fulfilled' && l.value?.length) setLivestock(l.value);
        if (f.status === 'fulfilled' && f.value?.length) setFinancials(f.value);
        if (a.status === 'fulfilled' && a.value?.length) setArticles(a.value);
        if (m.status === 'fulfilled' && m.value?.length) setMessages(m.value);
        if (fm.status === 'fulfilled' && fm.value?.length) setFarms(fm.value);
      } catch (err) {
        console.warn('Backend loading defaulted to initial records', err);
      }
    }
    initData();
  }, [currentUser]);

  // Product actions
  const handleProductAdded = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
    } catch {
      // Local fallback
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Order actions
  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    // Deduct quantity from local products state
    order.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.productId
            ? {
                ...p,
                quantityAvailable: Math.max(0, p.quantityAvailable - item.quantity),
                status: p.quantityAvailable - item.quantity <= 0 ? 'sold' : p.status,
              }
            : p
        )
      );
    });
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['orderStatus']) => {
    try {
      await api.updateOrderStatus(id, status);
    } catch {}
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: status } : o))
    );
  };

  // Crop actions
  const handleAddCrop = async (cropData: Partial<CropRecord>) => {
    try {
      const created = await api.createCrop(cropData);
      setCrops((prev) => [...prev, created]);
    } catch {
      const localCrop: CropRecord = {
        id: `crop_${Date.now()}`,
        farmId: cropData.farmId || 'farm_1',
        userId: cropData.userId || 'usr_farmer_1',
        cropName: cropData.cropName || 'Maize',
        variety: cropData.variety || 'Hybrid',
        plantingDate: cropData.plantingDate || new Date().toISOString().split('T')[0],
        expectedHarvestDate: cropData.expectedHarvestDate || '',
        acreage: cropData.acreage || 1,
        stage: cropData.stage || 'Vegetative',
        healthStatus: cropData.healthStatus || 'Healthy',
        notes: cropData.notes,
      };
      setCrops((prev) => [...prev, localCrop]);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    try {
      await api.deleteCrop(id);
    } catch {}
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  // Livestock actions
  const handleAddLivestock = async (animalData: Partial<LivestockRecord>) => {
    try {
      const created = await api.createLivestock(animalData);
      setLivestock((prev) => [...prev, created]);
    } catch {
      const localAnimal: LivestockRecord = {
        id: `live_${Date.now()}`,
        farmId: animalData.farmId || 'farm_1',
        userId: animalData.userId || 'usr_farmer_1',
        tagNumber: animalData.tagNumber || 'BATCH',
        animalType: animalData.animalType || 'Dairy Cow',
        breed: animalData.breed || 'Friesian',
        count: animalData.count || 1,
        healthStatus: animalData.healthStatus || 'Healthy',
        feedingSchedule: animalData.feedingSchedule || '',
        milkYieldLpd: animalData.milkYieldLpd,
        lastVeterinaryCheck: animalData.lastVeterinaryCheck || '',
        notes: animalData.notes,
      };
      setLivestock((prev) => [...prev, localAnimal]);
    }
  };

  const handleDeleteLivestock = async (id: string) => {
    try {
      await api.deleteLivestock(id);
    } catch {}
    setLivestock((prev) => prev.filter((l) => l.id !== id));
  };

  // Financial actions
  const handleAddFinancial = async (recordData: Partial<FinancialRecord>) => {
    try {
      const created = await api.createFinancial(recordData);
      setFinancials((prev) => [created, ...prev]);
    } catch {
      const localFin: FinancialRecord = {
        id: `fin_${Date.now()}`,
        userId: recordData.userId || 'usr_farmer_1',
        type: recordData.type || 'expense',
        category: recordData.category || 'Fertilizer',
        amount: recordData.amount || 0,
        description: recordData.description || '',
        date: recordData.date || new Date().toISOString().split('T')[0],
      };
      setFinancials((prev) => [localFin, ...prev]);
    }
  };

  const handleDeleteFinancial = async (id: string) => {
    try {
      await api.deleteFinancial(id);
    } catch {}
    setFinancials((prev) => prev.filter((f) => f.id !== id));
  };

  // Article actions
  const handleArticleCreated = (article: Article) => {
    setArticles((prev) => [article, ...prev]);
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await api.deleteArticle(id);
    } catch {}
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Messaging actions
  const handleSendMessage = async (msgData: Partial<Message>) => {
    try {
      const created = await api.sendMessage(msgData);
      setMessages((prev) => [...prev, created]);
    } catch {
      const localMsg: Message = {
        id: `msg_${Date.now()}`,
        senderId: msgData.senderId || 'usr_farmer_1',
        senderName: msgData.senderName || 'Sender',
        senderRole: msgData.senderRole || 'farmer',
        receiverId: msgData.receiverId || 'usr_buyer_1',
        receiverName: msgData.receiverName || 'Receiver',
        receiverRole: msgData.receiverRole || 'buyer',
        content: msgData.content || '',
        productTitle: msgData.productTitle,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, localMsg]);
    }
  };

  const handleContactSeller = (product: Product) => {
    handleSendMessage({
      senderId: currentUser?.id || 'usr_buyer_1',
      senderName: currentUser?.name || 'Produce Buyer',
      senderRole: currentUser?.role || 'buyer',
      receiverId: product.sellerId,
      receiverName: product.sellerName,
      receiverRole: 'farmer',
      content: `Hello ${product.sellerName}, I am inquiring regarding your listing "${product.title}" priced at KSh ${product.price.toLocaleString()} per ${product.unit}. Are the items available for direct farm-gate collection this week?`,
      relatedProductId: product.id,
      productTitle: product.title,
    });
    setActiveTab('messages');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7]">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddProduct={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <Hero
              onExploreMarket={() => setActiveTab('marketplace')}
              onOpenFarmManager={() => setActiveTab('farm-manager')}
              onOpenWeather={() => setActiveTab('weather')}
              onOpenLearning={() => setActiveTab('education')}
            />

            {/* Farmer Dashboard Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
              <FarmerDashboard
                products={products}
                orders={orders}
                crops={crops}
                financials={financials}
                onNavigateTab={setActiveTab}
                onOpenAddProduct={() => setIsAddModalOpen(true)}
              />
            </div>

            {/* Marketplace Preview Section */}
            <Marketplace
              products={products}
              onProductAdded={handleProductAdded}
              onContactSeller={handleContactSeller}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          </div>
        )}

        {/* TAB 2: MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            onProductAdded={handleProductAdded}
            onContactSeller={handleContactSeller}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )}

        {/* TAB 3: FARM MANAGEMENT */}
        {activeTab === 'farm-manager' && (
          <FarmManager
            farms={farms}
            crops={crops}
            livestock={livestock}
            financials={financials}
            onAddCrop={handleAddCrop}
            onDeleteCrop={handleDeleteCrop}
            onAddLivestock={handleAddLivestock}
            onDeleteLivestock={handleDeleteLivestock}
            onAddFinancial={handleAddFinancial}
            onDeleteFinancial={handleDeleteFinancial}
          />
        )}

        {/* TAB 4: LIVE WEATHER STATION */}
        {activeTab === 'weather' && <WeatherWidget />}

        {/* TAB 5: EDUCATION CENTER */}
        {activeTab === 'education' && (
          <EducationCenter
            articles={articles}
            onArticleCreated={handleArticleCreated}
          />
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === 'messages' && (
          <MessagingCenter
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* TAB 7: ADMIN CONTROL CONSOLE */}
        {activeTab === 'admin' && (
          <div>
            {currentUser?.role === 'admin' ? (
              <AdminDashboard
                products={products}
                orders={orders}
                articles={articles}
                onDeleteProduct={handleDeleteProduct}
                onDeleteArticle={handleDeleteArticle}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            ) : (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-stone-200 text-center shadow-xs">
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Admin Privileges Required
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  You are currently viewing as{' '}
                  <span className="font-semibold capitalize text-stone-800">
                    {currentUser?.name} ({currentUser?.role})
                  </span>
                  . Switch to Administrator to access the moderation console.
                </p>
                <button
                  onClick={() => switchAccount('admin')}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Switch to Admin Profile Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SUPPORT & COMPLIANCE */}
        {activeTab === 'support' && <SupportPages />}
      </main>

      <Footer onNavigate={setActiveTab} />
      <CartDrawer onOrderPlaced={handleOrderPlaced} />
      <AuthModal />
      <ProfileModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}
