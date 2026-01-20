"use client";

import { LayoutWrapper } from '@/components/layout-wrapper';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Leaf,
  Sprout,
  Truck,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Clock,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

const ProductsPage = () => {
  const { t } = useLanguage();

  const products = [
    {
      id: 1,
      name: "Organic Fertilizers",
      category: "Soil Health",
      price: "₹450",
      originalPrice: "₹600",
      discount: "25% OFF",
      image: "🌱",
      rating: 4.8,
      reviews: 124,
      features: ["100% Organic", "Improves Soil Fertility", "Safe for Crops", "5kg Pack"],
      delivery: "Free Delivery",
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "Bio Pesticides",
      category: "Pest Control",
      price: "₹320",
      originalPrice: "₹400",
      discount: "20% OFF",
      image: "🐞",
      rating: 4.6,
      reviews: 89,
      features: ["Eco-Friendly", "Effective Pest Control", "Non-Toxic", "2L Bottle"],
      delivery: "Free Delivery",
      badge: "NEW"
    },
    {
      id: 3,
      name: "Seeds Premium Pack",
      category: "Seeds",
      price: "₹280",
      originalPrice: "₹350",
      discount: "20% OFF",
      image: "🌾",
      rating: 4.9,
      reviews: 156,
      features: ["High Yield Variety", "Disease Resistant", "95% Germination", "Mixed Crops"],
      delivery: "Free Delivery",
      badge: "POPULAR"
    },
    {
      id: 4,
      name: "Irrigation Kit",
      category: "Equipment",
      price: "₹1,299",
      originalPrice: "₹1,800",
      discount: "28% OFF",
      image: "💧",
      rating: 4.7,
      reviews: 67,
      features: ["Drip Irrigation", "Water Saving", "Easy Installation", "Complete Kit"],
      delivery: "Free Delivery",
      badge: "ECO-FRIENDLY"
    },
    {
      id: 5,
      name: "Soil Testing Kit",
      category: "Testing",
      price: "₹899",
      originalPrice: "₹1,200",
      discount: "25% OFF",
      image: "🔬",
      rating: 4.5,
      reviews: 92,
      features: ["pH Testing", "Nutrient Analysis", "Easy to Use", "Digital Display"],
      delivery: "Free Delivery",
      badge: "PRECISION"
    },
    {
      id: 6,
      name: "Crop Protection Net",
      category: "Protection",
      price: "₹750",
      originalPrice: "₹1,000",
      discount: "25% OFF",
      image: "🕸",
      rating: 4.4,
      reviews: 78,
      features: ["UV Protected", "Durable", "Bird Protection", "10x10m Size"],
      delivery: "Free Delivery",
      badge: "PROTECTION"
    }
  ];

  const categories = [
    { name: "Fertilizers", icon: "🌿", count: "24 Products" },
    { name: "Seeds", icon: "🌱", count: "18 Products" },
    { name: "Pest Control", icon: "🐛", count: "15 Products" },
    { name: "Equipment", icon: "⚙", count: "32 Products" },
    { name: "Organic", icon: "🥬", count: "28 Products" },
    { name: "Tools", icon: "🛠", count: "20 Products" }
  ];

  const benefits = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹500 across India"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Quality Guarantee",
      description: "100% quality assurance with money-back guarantee"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Farmer First",
      description: "Products curated specifically for farmers"
    }
  ];

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Quality Agricultural Products
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Krishi Sakhi Market
          </h1>
          
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Discover premium farming products, tools, and supplies curated specifically for agricultural needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-800 hover:bg-green-50 px-8 py-3 text-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white bg-green-700  hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
            >
              View Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h2>
            <p className="text-lg text-gray-600">Find everything you need for successful farming</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-lg text-gray-600">Best selling products trusted by farmers</p>
            </div>
            <Button variant="outline" className="hidden sm:flex">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        product.badge === "BESTSELLER" ? "bg-red-100 text-red-800" :
                        product.badge === "NEW" ? "bg-blue-100 text-blue-800" :
                        product.badge === "POPULAR" ? "bg-orange-100 text-orange-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-6xl text-center mb-4">{product.image}</div>
                  
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    Premium quality product for better yield and crop protection
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">{product.delivery}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      <span className="text-sm font-medium text-red-600">{product.discount}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Button>
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Krishi Sakhi Market?</h2>
            <p className="text-lg text-gray-600">We're committed to supporting farming community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-green-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5000+</div>
              <div className="text-gray-600">Happy Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600">Quality Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers who are already benefiting from Krishi Sakhi products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/krishi-sakhi-chat">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 px-8">
                Get Product Advice
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700 px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
};

export default ProductsPage;