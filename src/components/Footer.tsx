
import { Twitter, Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md p-1.5">
                
              </div>
              <h2 className="text-xl font-bold">Hostelio</h2>
            </div>
            <p className="text-gray-400 mb-6">
              The complete management solution for modern hostels and guest accommodations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-800 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-800 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Pricing
                </a>
              </li>
            
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold  mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>saiaman88888@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>+91 9347895644</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Parvathipuram, Andhra Pradesh</span>
              </li>
            </ul>
          </div>

       
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} HostelPro. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

