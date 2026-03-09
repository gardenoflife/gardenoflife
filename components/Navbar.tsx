import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="shadow-sm" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              Stim
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Generate
              </Link>
              <Link 
                href="/uid" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
