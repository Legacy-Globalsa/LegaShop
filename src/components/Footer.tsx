import logo from "@/assets/legashop-logo1.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/70 py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="LEGASHOP" className="w-[120px] h-auto"/>
            </div>
            <p className="text-sm">
              "Lega lang, kababayan." — Your affordable grocery, wherever you are. 🇵🇭
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">1 SAR Deals</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">5 SAR Deals</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Nearby Stores</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-3 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Send to Philippines</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Become a Partner</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Delivery Zones</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary-foreground mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 LEGASHOP. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>🏦 Mada</span>
            <span>💳 Visa</span>
            <span>📱 Apple Pay</span>
            <span>💵 COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
