import Navbar from "../components/Navbar"

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to our site!</h1>
        <p className="mt-4 text-lg text-gray-500">This is a demo page to showcase the navigation bar.</p>
      </main>
    </div>
  )
}

export default Home

