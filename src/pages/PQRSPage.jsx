"use client"

import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import Header from "../components/common/Header"
import PQRSList from "../components/pqrs/PQRSList"
import PQRSForm from "../components/pqrs/PQRSForm"
import PQRSDetail from "../components/pqrs/PQRSDetail"

const PQRSPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<PQRSList />} />
            <Route path="/create" element={<PQRSForm onSuccess={() => (window.location.href = "/pqrs")} />} />
            <Route path="/:id" element={<PQRSDetail />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default PQRSPage
