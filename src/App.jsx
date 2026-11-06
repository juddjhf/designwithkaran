import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { HomePage, AboutPage, PortfolioPage, VideosPage, ServicesPage, ContactPage, BookingPage, OrderStatusPage, AdminLoginPage, AdminPage, NotFoundPage } from './pages'
import './index.css'
import './admin.css'
import './redesign.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<PortfolioPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/order/:orderId" element={<OrderStatusPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
