import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gray-50 border-t">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Machine Learning</h3>
            <p className="text-sm text-gray-500">
              Essential tools and courses for online store operators to maximize their profits.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-gray-500 hover:text-blue-600">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/free-lecture" className="text-gray-500 hover:text-blue-600">
                  0 Won Special Lecture
                </Link>
              </li>
              <li>
                <Link href="/paid-course" className="text-gray-500 hover:text-blue-600">
                  Monthly 3000 Achievement Project
                </Link>
              </li>
              <li>
                <Link href="/my-class" className="text-gray-500 hover:text-blue-600">
                  My Class
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-500 hover:text-blue-600">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-500 hover:text-blue-600">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">123 E-commerce Street, Seoul, South Korea</li>
              <li>
                <Link href="mailto:info@machinelearning.com" className="text-gray-500 hover:text-blue-600">
                  info@machinelearning.com
                </Link>
              </li>
              <li>
                <Link href="tel:+821012345678" className="text-gray-500 hover:text-blue-600">
                  +82 10 1234 5678
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Machine Learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

