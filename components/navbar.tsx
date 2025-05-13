"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, User, History, Settings, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [showSignInOptions, setShowSignInOptions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSignInOptions(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center group focus:outline-none"
            >
              <div className="bg-gradient-blue p-2 rounded-lg mr-2 shadow-lg transform transition-transform group-hover:rotate-12">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                AdCreator
              </span>
              <ChevronDown
                className={`ml-1 h-4 w-4 text-blue-600 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">AdCreator Menu</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your content</p>
                </div>
                <div className="p-2">
                  <Link
                    href="/history"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                  >
                    <History className="h-5 w-5 text-blue-500" />
                    <span>Generation History</span>
                  </Link>
                  <Link
                    href="/saved"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                  >
                    <User className="h-5 w-5 text-blue-500" />
                    <span>Saved Designs</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                  >
                    <Settings className="h-5 w-5 text-blue-500" />
                    <span>Account Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <Button
              className="btn-primary hidden sm:flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              onClick={() => setShowSignInOptions(!showSignInOptions)}
            >
              <span className="font-medium">Sign in</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>

            {/* Sign-in dropdown */}
            {showSignInOptions && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Sign in to continue</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose your preferred method</p>
                </div>
                <div className="p-3">
                  <button
                    onClick={() => {
                      // Non-functional button
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="h-5 w-5"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
