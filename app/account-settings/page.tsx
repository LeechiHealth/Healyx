"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, FileUp, FileDown } from "lucide-react"

export default function AccountSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [accountInfo, setAccountInfo] = useState({
    adminName: "Dr. Example Admin",
    organization: "Example Healthcare",
    npi: "1234567890",
    email: "admin@example.com",
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Performance data (would normally come from API)
  const performanceData = {
    totalPatients: 1248,
    activePatients: 932,
    appointmentsThisMonth: 412,
    appointmentCompletionRate: 94,
    noShowRate: 6,
    avgWaitTime: 12,
    patientSatisfaction: 4.8,
  }

  // Monthly appointment data for the chart
  const monthlyAppointments = [
    { month: "Jan", count: 340 },
    { month: "Feb", count: 390 },
    { month: "Mar", count: 412 },
  ]

  const handleInputChange = (e) => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value })
  }

  const handleSaveAccountInfo = async () => {
    setIsSaving(true)
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    toast({
      title: "Account updated",
      description: "Your account information has been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <button onClick={toggleMenu} className="text-xl text-white focus:outline-none">
              ☰
            </button>
            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => router.push("/calendar")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                >
                  Home
                </button>
                <button
                  onClick={() => router.push("/account-settings")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                >
                  Account
                </button>
                <button
                  onClick={() => router.push("/help")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                >
                  Help
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-blue-400">Account Settings</h1>
          <div className="w-8"></div> {/* Empty div for balanced spacing */}
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Account
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="import-export"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Import/Export
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Account Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="editing-mode" className="text-gray-300">
                    Editing Mode
                  </Label>
                  <Switch id="editing-mode" checked={isEditing} onCheckedChange={setIsEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-name" className="text-gray-300">
                    Admin Name
                  </Label>
                  <Input
                    id="admin-name"
                    name="adminName"
                    value={accountInfo.adminName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-gray-300">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={accountInfo.organization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npi" className="text-gray-300">
                    NPI
                  </Label>
                  <Input
                    id="npi"
                    name="npi"
                    value={accountInfo.npi}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={!isEditing || isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 text-gray-100">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-blue-400">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action will update your account information. Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSaveAccountInfo}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Billing Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your payment methods and subscription.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href="https://billing.stripe.com/p/login/7sIg34dTQa5odNu4gg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </Button>
                </a>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import/Export Tab */}
          <TabsContent value="import-export">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Import/Export Patients</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your patient data by importing or exporting CSV files.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FileUp className="mr-2 h-4 w-4" />
                  Import Patients
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export Patients
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

