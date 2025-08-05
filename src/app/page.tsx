import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-secondary-800 mb-6">
            Professional Proposals for{' '}
            <span className="text-primary-600">Glazing Contractors</span>
          </h2>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Create winning bids in minutes, not hours. Built specifically for 
            glazing and storefront contractors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Building Proposals
            </Button>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-secondary-800 mb-12">
            Everything You Need to Win More Bids
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary-800 mb-2">
                Quick Proposals
              </h4>
              <p className="text-secondary-600">
                Create professional proposals in under 30 minutes with our streamlined workflow.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-600 text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary-800 mb-2">
                Smart Pricing
              </h4>
              <p className="text-secondary-600">
                Built-in pricing database and calculations ensure accurate, competitive bids.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📄</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary-800 mb-2">
                Professional PDFs
              </h4>
              <p className="text-secondary-600">
                Generate branded, professional PDFs that impress clients and win contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-secondary-800 mb-12">
            UI Components
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h4 className="text-xl font-semibold text-secondary-800 mb-4">Button Variants</h4>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-xl font-semibold text-secondary-800 mb-4">Logo Component</h4>
              <div className="space-y-4">
                <Logo size="sm" />
                <Logo size="md" />
                <Logo size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
