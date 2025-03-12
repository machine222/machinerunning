"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, ArrowLeft, CreditCard } from "lucide-react"

export default function PurchasePage() {
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "79,000",
      description: "Perfect for beginners looking to start their e-commerce journey",
      features: [
        "Basic keyword research tools",
        "Standard profit calculator",
        "Weekly market reports",
        "Email support",
        "Access to community forum",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "120,000",
      description: "For serious sellers looking to scale their business",
      features: [
        "Advanced keyword research tools",
        "Advanced profit optimization",
        "Daily market reports & analysis",
        "Priority email & chat support",
        "Monthly group coaching calls",
        "Competitor analysis tools",
      ],
      popular: true,
    },
    {
      id: "master",
      name: "Master Class",
      price: "199,000",
      description: "The ultimate package for professional e-commerce entrepreneurs",
      features: [
        "All Premium features",
        "1-on-1 weekly coaching calls",
        "Custom business strategy plan",
        "Advanced AI market predictions",
        "VIP access to exclusive events",
        "Direct access to our expert team",
      ],
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would handle the payment processing
    alert("Payment successful! Welcome to the program.")
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Monthly 3000 Achievement Project</h1>
            <p className="mt-4 text-lg text-gray-600">Choose your plan and start your journey to e-commerce success</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Choose Plan</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Your Information</span>
              </div>
              <div className="h-0.5 w-12 bg-gray-200"></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <RadioGroup
                value={selectedPlan}
                onValueChange={setSelectedPlan}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {plans.map((plan) => (
                  <div key={plan.id} className="relative">
                    <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                    <Label
                      htmlFor={plan.id}
                      className={`flex flex-col h-full rounded-xl border-2 p-6 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 right-4">
                          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-3xl font-bold">₩{plan.price}</span>
                          <span className="ml-1 text-gray-500">/month</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                      </div>
                      <ul className="space-y-2 flex-grow mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-end mt-8">
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Please provide your details to continue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Complete your purchase securely</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" placeholder="Enter the name on your card" required />
                      </div>
                      <div className="pt-4 flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          Back
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Pay ₩{selectedPlanData?.price}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{selectedPlanData?.name} Plan</span>
                      <span>₩{selectedPlanData?.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Monthly subscription</span>
                      <span>Billed monthly</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₩{selectedPlanData?.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 text-sm text-gray-500 rounded-b-lg">
                    <p>You can cancel your subscription anytime. No hidden fees.</p>
                  </CardFooter>
                </Card>
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm text-gray-600">
                      <span className="font-medium">100% Satisfaction Guarantee:</span> 14-day money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

